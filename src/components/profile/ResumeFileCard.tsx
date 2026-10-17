'use client';

import Link from 'next/link';
import { Eye, FileText, ListTree } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Resume } from '@/lib/types/resume';
import { formatBytes, formatDate } from '@/lib/utils/format';

interface ResumeFileCardProps {
  resume: Resume;
}

export function ResumeFileCard({ resume }: ResumeFileCardProps) {
  const latestVersion = resume.versions[0];

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{resume.originalFileName}</p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(resume.fileSizeBytes)} · Uploaded{' '}
              {formatDate(resume.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Badge variant={resume.status === 'PARSED' ? 'default' : 'outline'}>
            {resume.status}
          </Badge>

          <Button
            variant="outline"
            size="sm"
            render={<Link href={`/resumes/${resume.id}`} />}
          >
            <ListTree />
            Details
          </Button>

          {latestVersion?.rawText ? (
            <Dialog>
              <DialogTrigger render={<Button variant="outline" size="sm" />}>
                <Eye />
                View text
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{resume.originalFileName}</DialogTitle>
                  <DialogDescription>
                    The text CareerForge extracted from your resume.
                  </DialogDescription>
                </DialogHeader>
                <pre className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm">
                  {latestVersion.rawText}
                </pre>
              </DialogContent>
            </Dialog>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
