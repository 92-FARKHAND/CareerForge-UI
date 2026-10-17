
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FileText, Upload, AlertTriangle } from 'lucide-react';

import { ResumeCard } from '@/components/resumes/ResumeCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { ProcessingState } from '@/components/shared/ProcessingState';
import { Button } from '@/components/ui/button';
import { useResumes } from '@/lib/hooks/account-queries';
import { useDeleteResumeMutation } from '@/lib/redux/api/resumeApi';

export default function ResumesPage() {
  const {
    data: resumes = [],
    isLoading,
    isError,
    refetch,
  } = useResumes();

  const [deleteResume] = useDeleteResumeMutation();
  const [showActiveResumeWarning, setShowActiveResumeWarning] =
    useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resumes"
        description="Every resume you've uploaded. The active one is used for your profile and compatibility checks."
        actions={
          <Button variant="outline" render={<Link href="/profile" />}>
            <Upload />
            Upload new
          </Button>
        }
      />

      {showActiveResumeWarning && (
        <div
          role="alert"
          className="flex flex-col gap-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />

            <div className="space-y-1">
              <h3 className="font-semibold">
                Replace your active resume first
              </h3>

              <p className="text-sm text-muted-foreground">
                Your active resume is currently used for compatibility
                analysis. To continue compatibility analysis, upload a
                replacement resume on your profile before removing the
                active one.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col">
            <Button render={<Link href="/profile" />}>
              <Upload />
              Upload Resume
            </Button>

            <Button
              variant="ghost"
              onClick={() => setShowActiveResumeWarning(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <ProcessingState
          title="Loading your resumes…"
          description="Fetching everything you've uploaded."
        />
      ) : isError ? (
        <div className="space-y-3">
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            Could not load your resumes.
          </p>

          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : resumes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No resumes yet"
          description="Upload your resume on the profile page and it will show up here."
          action={
            <Button render={<Link href="/profile" />}>
              Upload Resume
            </Button>
          }
        />
      ) : (
        <ul className="space-y-3">
          {resumes.map((resume) => (
            <li key={resume.id}>
              <ResumeCard
                resume={resume}
                onDelete={(id) => {
                  const selectedResume = resumes.find(
                    (item) => item.id === id
                  );

                  if (selectedResume?.isActive) {
                    setShowActiveResumeWarning(true);
                    return;
                  }

                  return deleteResume(id).unwrap();
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
