
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, FileX } from 'lucide-react';

import { ResumeVersionDetail } from '@/components/resumes/ResumeVersionDetail';
import { DetailField } from '@/components/shared/DetailField';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { ProcessingState } from '@/components/shared/ProcessingState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useResumes } from '@/lib/hooks/account-queries';
import { formatBytes, formatDateTime } from '@/lib/utils/format';

export default function ResumeDetailPage() {
  const { id } = useParams<{ id: string }>();

  // Reuse the resumes list and select the requested resume.
  const { data: resumes, isLoading, isError, refetch } = useResumes();
  const resume = resumes?.find((candidate) => candidate.id === id);

  const backButton = (
    <Button variant="outline" render={<Link href="/resumes" />}>
      <ArrowLeft />
      All resumes
    </Button>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Resume" actions={backButton} />
        <ProcessingState
          title="Loading resume…"
          description="Fetching every extracted field."
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
        actions={backButton}
      />

      <Card>
        <CardHeader>
          <CardTitle>File</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailField label="File name">
              {resume.originalFileName}
            </DetailField>
            <DetailField label="File type">
              {resume.mimeType}
            </DetailField>
            <DetailField label="File size">
              {formatBytes(resume.fileSizeBytes)}
            </DetailField>
            <DetailField label="Status">
              <Badge variant={resume.status === 'PARSED' ? 'default' : 'outline'}>
                {resume.status}
              </Badge>
            </DetailField>
            <DetailField label="Active resume">
              {resume.isActive ? 'Yes' : 'No'}
            </DetailField>
            <DetailField label="Uploaded">
              {formatDateTime(resume.createdAt)}
            </DetailField>
            <DetailField label="Last updated">
              {formatDateTime(resume.updatedAt)}
            </DetailField>
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
            <TabsContent
              key={version.id}
              value={version.id}
              className="mt-4"
            >
              <ResumeVersionDetail version={version} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
