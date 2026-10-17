'use client';

import Link from 'next/link';
import { Eye, FileText } from 'lucide-react';

import { ConfirmDeleteButton } from '@/components/shared/ConfirmDeleteButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatBytes, formatDate } from '@/lib/utils/format';
import type { Resume } from '@/lib/types/resume';

interface ResumeCardProps {
  resume: Resume;
  onDelete: (resumeId: string) => Promise<unknown>;
}

export function ResumeCard({ resume, onDelete }: ResumeCardProps) {
  const latest = resume.versions[0];
  const skillCount = latest?.skills?.length ?? 0;

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="break-all font-medium">{resume.originalFileName}</p>
              {resume.isActive ? <Badge>Active</Badge> : null}
              <Badge variant={resume.status === 'PARSED' ? 'secondary' : 'outline'}>
                {resume.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatBytes(resume.fileSizeBytes)} · Uploaded{' '}
              {formatDate(resume.createdAt)}
            </p>
            {latest ? (
              <p className="text-xs text-muted-foreground">
                {latest.name ?? 'Unnamed'} · {skillCount}{' '}
                {skillCount === 1 ? 'skill' : 'skills'} · {resume.versions.length}{' '}
                {resume.versions.length === 1 ? 'version' : 'versions'}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            render={<Link href={`/resumes/${resume.id}`} />}
          >
            <Eye />
            View
          </Button>
          <ConfirmDeleteButton
            label="Delete resume"
            title="Delete this resume?"
            description={`"${resume.originalFileName}" and its extracted data will be removed.${
              resume.isActive
                ? ' This is your active resume, so your profile and compatibility checks will no longer have a resume to use until you upload another.'
                : ''
            } This can't be undone from here.`}
            onConfirm={() => onDelete(resume.id)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
