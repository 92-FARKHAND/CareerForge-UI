'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FileX } from 'lucide-react';

import { CompatibilityResultView } from '@/components/compatibility/CompatibilityResultView';
import { ConfirmDeleteButton } from '@/components/shared/ConfirmDeleteButton';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { ProcessingState } from '@/components/shared/ProcessingState';
import { Button } from '@/components/ui/button';
import { useCompatibilityHistory } from '@/lib/hooks/account-queries';
import { fromCompatibilityHistoryItem } from '@/lib/mappers/profile';
import { useDeleteCompatibilityAnalysisMutation } from '@/lib/redux/api/compatibilityApi';

export default function CompatibilityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // No GET /compatibility/:id: every history item from GET /compatibility
  // already has all the fields this view shows, so pick it from the list
  // (a cache hit when arriving from the history tab).
  const { data: history, isLoading, isError, refetch } =
    useCompatibilityHistory();
  const item = history?.find((candidate) => candidate.id === id);
  const [deleteAnalysis] = useDeleteCompatibilityAnalysisMutation();
  const [isDeleting, setIsDeleting] = useState(false);

  const backButton = (
    <Button variant="outline" render={<Link href="/compatibility" />}>
      <ArrowLeft />
      Back
    </Button>
  );

  if (isLoading || (isDeleting && !item)) {
    return (
      <div className="space-y-6">
        <PageHeader title="Compatibility result" actions={backButton} />
        <ProcessingState
          title={isDeleting ? 'Deleting…' : 'Loading result…'}
          description={
            isDeleting
              ? 'Removing this analysis.'
              : 'Fetching your compatibility history.'
          }
        />
      </div>
    );
  }

  if (isError && !history) {
    return (
      <div className="space-y-6">
        <PageHeader title="Compatibility result" actions={backButton} />
        <EmptyState
          icon={FileX}
          title="Could not load this analysis"
          description="Something went wrong while loading your history."
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="space-y-6">
        <PageHeader title="Compatibility result" actions={backButton} />
        <EmptyState
          icon={FileX}
          title="Analysis not found"
          description="It may have been deleted."
        />
      </div>
    );
  }

  const result = fromCompatibilityHistoryItem(item);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compatibility result"
        description={result.targetRole ?? undefined}
        actions={
          <>
            {backButton}
            <ConfirmDeleteButton
              showLabel
              label="Delete"
              title="Delete this analysis?"
              description="This compatibility result will be removed from your history. This can't be undone from here."
              onConfirm={async () => {
                // Set first so the page doesn't flash "not found" once the
                // delete drops this item from the cached history.
                setIsDeleting(true);
                try {
                  await deleteAnalysis(result.id).unwrap();
                  router.replace('/compatibility');
                } catch (error) {
                  setIsDeleting(false);
                  throw error;
                }
              }}
            />
          </>
        }
      />

      <CompatibilityResultView
        result={result}
        onRunAnother={() => router.push('/compatibility')}
      />
    </div>
  );
}
