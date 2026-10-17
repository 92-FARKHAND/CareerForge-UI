'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FileX } from 'lucide-react';

import { ResumeVersionDetail } from '@/components/resumes/ResumeVersionDetail';
import { ConfirmDeleteButton } from '@/components/shared/ConfirmDeleteButton';
import { DetailField } from '@/components/shared/DetailField';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { ProcessingState } from '@/components/shared/ProcessingState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useResumes } from '@/lib/hooks/account-queries';
import { useDeleteResumeMutation } from '@/lib/redux/api/resumeApi';
import { formatBytes, formatDateTime } from '@/lib/utils/format';

export default function ResumeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // No GET /resumes/:id: GET /resumes already returned every resume with
  // all of its versions, so the detail view just picks this one out of the
  // list. Coming from the list page that's a cache hit (zero requests);
  // opening this URL directly loads the list once.
  const { data: resumes, isLoading, isError, refetch } = useResumes();
  const resume = resumes?.find((candidate) => candidate.id === id);
  const [deleteResume] = useDeleteResumeMutation();
  const [isDeleting, setIsDeleting] = useState(false);

  const backButton = (
    <Button variant="outline" render={<Link href="/resumes" />}>
      <ArrowLeft />
      All resumes
    </Button>
  );

  if (isLoading || (isDeleting && !resume)) {
    return (
      <div className="space-y-6">
        <PageHeader title="Resume" actions={backButton} />
        <ProcessingState
          title={isDeleting ? 'Deleting…' : 'Loading resume…'}
          description={
            isDeleting ? 'Removing this resume.' : 'Fetching every extracted field.'
          }
        />
      </div>
    );
  }

  if (isError && !resumes) {
    return (
      <div className="space-y-6">
        <PageHeader title="Resume" actions={backButton} />
        <EmptyState
          icon={FileX}
          title="Could not load this resume"
          description="Something went wrong while loading your resumes."
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="space-y-6">
        <PageHeader title="Resume" actions={backButton} />
        <EmptyState
          icon={FileX}
          title="Resume not found"
          description="It may have been deleted."
        />
      </div>
    );
  }

  const versions = resume.versions;

  return (
    <div className="space-y-6">
      <PageHeader
        title={resume.originalFileName}
        description="Everything extracted from this resume."
        actions={
          <>
            {backButton}
            <ConfirmDeleteButton
              showLabel
              label="Delete"
              title="Delete this resume?"
              description={`"${resume.originalFileName}" and its extracted data will be removed. This can't be undone from here.`}
              onConfirm={async () => {
                // Set before the request: the delete removes this resume
                // from the cached list, and without this the page would
                // flash "not found" before the redirect lands.
                setIsDeleting(true);
                try {
                  await deleteResume(resume.id).unwrap();
                  router.replace('/resumes');
                } catch (error) {
                  setIsDeleting(false);
                  throw error;
                }
              }}
            />
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>File</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailField label="File name">{resume.originalFileName}</DetailField>
            <DetailField label="File type">{resume.mimeType}</DetailField>
            <DetailField label="File size">{formatBytes(resume.fileSizeBytes)}</DetailField>
            <DetailField label="Status">
              <Badge variant={resume.status === 'PARSED' ? 'default' : 'outline'}>
                {resume.status}
              </Badge>
            </DetailField>
            <DetailField label="Active resume">
              {resume.isActive ? 'Yes' : 'No'}
            </DetailField>
            <DetailField label="Uploaded">{formatDateTime(resume.createdAt)}</DetailField>
            <DetailField label="Last updated">{formatDateTime(resume.updatedAt)}</DetailField>
          </dl>
        </CardContent>
      </Card>

      {versions.length === 0 ? (
        <EmptyState
          icon={FileX}
          title="No extracted data"
          description="This resume has no parsed versions yet."
        />
      ) : versions.length === 1 ? (
        <ResumeVersionDetail version={versions[0]} />
      ) : (
        <Tabs defaultValue={versions[0].id}>
          <TabsList>
            {versions.map((version, index) => (
              <TabsTrigger key={version.id} value={version.id}>
                {index === 0
                  ? 'Latest version'
                  : `Version ${versions.length - index}`}
              </TabsTrigger>
            ))}
          </TabsList>
          {versions.map((version) => (
            <TabsContent key={version.id} value={version.id} className="mt-4">
              <ResumeVersionDetail version={version} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
