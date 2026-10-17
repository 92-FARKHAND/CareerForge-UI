'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FileText } from 'lucide-react';

import { ExtractedProfileReview } from '@/components/profile/ExtractedProfileReview';
import { ResumeDropzone } from '@/components/profile/ResumeDropzone';
import { ResumeFileCard } from '@/components/profile/ResumeFileCard';
import { VerifiedProfileView } from '@/components/profile/VerifiedProfileView';
import { PageHeader } from '@/components/shared/PageHeader';
import { ProcessingState } from '@/components/shared/ProcessingState';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import {
  fromUploadResumeProfile,
  toProfileReviewValues,
  toVerifyResumePayload,
} from '@/lib/mappers/profile';
import { useActiveResume, useProfile } from '@/lib/hooks/account-queries';
import {
  useUploadResumeMutation,
  useVerifyResumeMutation,
} from '@/lib/redux/api/resumeApi';
import { setDraftResumeVersion } from '@/lib/redux/slices/profileSlice';
import type { ProfileReviewValues } from '@/lib/schemas/profile';
import { getApiErrorMessage } from '@/lib/utils/api-error';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const draftResumeVersion = useAppSelector(
    (state) => state.profile.draftResumeVersion,
  );

  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { data: activeResume, isLoading: isResumeLoading } = useActiveResume();

  const [uploadResume, { isLoading: isUploading }] = useUploadResumeMutation();
  const [verifyResume, { isLoading: isVerifying }] = useVerifyResumeMutation();

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);

  const isInitialLoading = isProfileLoading || isResumeLoading;

  const latestServerVersion = activeResume?.versions[0] ?? null;
  const reviewSourceVersion = draftResumeVersion ?? latestServerVersion;

  async function handleFileSelected(file: File) {
    setUploadError(null);

    try {
      const response = await uploadResume(file).unwrap();
      const resumeVersion = fromUploadResumeProfile(
        response.data.resumeId,
        response.data.versionId,
        response.data.status,
        response.data.profile,
      );
      dispatch(setDraftResumeVersion(resumeVersion));
      setIsReplacing(false);

      if (response.data.status !== 'PARSED') {
        setUploadError(
          'Your resume is still processing on the backend, so some fields below may be empty. You can fill them in manually.',
        );
      }
    } catch (error) {
      setUploadError(getApiErrorMessage(error, 'Upload failed — try again.'));
    }
  }

  async function handleConfirm(values: ProfileReviewValues) {
    const resumeVersionId = reviewSourceVersion?.id;
    if (!resumeVersionId) return;

    try {
      await verifyResume({
        resumeVersionId,
        payload: toVerifyResumePayload(values),
      }).unwrap();

      // GET /profile and GET /resumes/active both refetch automatically
      // (verifyResume invalidates the Resume/Profile tags) — just clear
      // the local draft now that the server has the confirmed version.
      dispatch(setDraftResumeVersion(null));
      setIsEditing(false);
      setIsReplacing(false);
      setUploadError(null);
    } catch (error) {
      setUploadError(getApiErrorMessage(error, 'Could not save your profile.'));
    }
  }

  function handleReplaceResume() {
    setUploadError(null);
    setIsEditing(false);
    setIsReplacing(true);
    dispatch(setDraftResumeVersion(null));
  }

  let stage: 'loading' | 'empty' | 'review' | 'complete';
  if (isInitialLoading) {
    stage = 'loading';
  } else if (draftResumeVersion || isEditing) {
    stage = 'review';
  } else if (isReplacing) {
    stage = 'empty';
  } else if (profile) {
    stage = 'complete';
  } else if (reviewSourceVersion) {
    stage = 'review';
  } else {
    stage = 'empty';
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Your verified profile, built from your resume once it's reviewed and confirmed."
        actions={
          <Button variant="outline" render={<Link href="/resumes" />}>
            <FileText />
            All resumes
          </Button>
        }
      />

      {activeResume ? <ResumeFileCard resume={activeResume} /> : null}

      {stage === 'loading' ? (
        <ProcessingState
          title="Loading your profile…"
          description="Checking whether you already have a resume or profile on file."
        />
      ) : null}

      {stage === 'empty' ? (
        <div className="space-y-3">
          {isReplacing ? (
            <Button variant="ghost" onClick={() => setIsReplacing(false)}>
              Cancel
            </Button>
          ) : null}
          <ResumeDropzone
            onFileSelected={handleFileSelected}
            isUploading={isUploading}
            error={uploadError}
          />
        </div>
      ) : null}

      {stage === 'review' ? (
        <>
          {uploadError ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {uploadError}
            </p>
          ) : null}
          <ExtractedProfileReview
            initialValues={toProfileReviewValues(reviewSourceVersion, profile, {
              preferResumeData: Boolean(draftResumeVersion),
            })}
            onConfirm={handleConfirm}
            isSubmitting={isVerifying}
          />
        </>
      ) : null}

      {stage === 'complete' && profile ? (
        <VerifiedProfileView
          profile={toProfileReviewValues(latestServerVersion, profile)}
          // Confirming an edit needs a resume version to PATCH, so with no
          // resume on file the profile is view-only until one is uploaded.
          canEdit={Boolean(latestServerVersion)}
          replaceLabel={latestServerVersion ? 'Replace resume' : 'Upload resume'}
          onEdit={() => setIsEditing(true)}
          onReplaceResume={handleReplaceResume}
        />
      ) : null}
    </div>
  );
}
