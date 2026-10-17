'use client';

import Link from 'next/link';
import { Eye, History } from 'lucide-react';

import { ConfirmDeleteButton } from '@/components/shared/ConfirmDeleteButton';
import { EmptyState } from '@/components/shared/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { CompatibilityHistoryItem } from '@/lib/types/compatibility';
import { formatDate } from '@/lib/utils/format';

interface CompatibilityHistoryListProps {
  history: CompatibilityHistoryItem[];
  onDelete: (analysisId: string) => Promise<unknown>;
}

export function CompatibilityHistoryList({
  history,
  onDelete,
}: CompatibilityHistoryListProps) {
  if (history.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="No checks yet"
        description="Run your first compatibility check and it'll show up here."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {history.map((item) => (
        <li key={item.id}>
          <Card>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{item.targetRole ?? 'Untitled role'}</p>
                  {item.readinessLevel ? (
                    <Badge variant="outline">{item.readinessLevel}</Badge>
                  ) : null}
                  {item.status !== 'COMPLETED' ? (
                    <Badge variant="destructive">{item.status}</Badge>
                  ) : null}
                </div>
                {item.jobDescription ? (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {item.jobDescription}
                  </p>
                ) : null}
                <p className="text-xs text-muted-foreground">
                  Analyzed {formatDate(item.createdAt)}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Badge variant="secondary" className="mr-1">
                  {item.overallScore ?? '—'}/100
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href={`/compatibility/${item.id}`} />}
                >
                  <Eye />
                  View
                </Button>
                <ConfirmDeleteButton
                  label="Delete analysis"
                  title="Delete this analysis?"
                  description={`Your "${item.targetRole ?? 'untitled'}" compatibility result will be removed from your history. This can't be undone from here.`}
                  onConfirm={() => onDelete(item.id)}
                />
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
