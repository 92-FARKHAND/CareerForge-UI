'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserRound } from 'lucide-react';

import { CompatibilityHistoryList } from '@/components/compatibility/CompatibilityHistoryList';
import { CompatibilityInputForm } from '@/components/compatibility/CompatibilityInputForm';
import { CompatibilityResultView } from '@/components/compatibility/CompatibilityResultView';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { ProcessingState } from '@/components/shared/ProcessingState';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  toAnalyzeCompatibilityPayload,
  toProfileReviewValues,
} from '@/lib/mappers/profile';
import {
  useAnalyzeCompatibilityMutation,
  useDeleteCompatibilityAnalysisMutation,
} from '@/lib/redux/api/compatibilityApi';
import {
  useActiveResume,
  useCompatibilityHistory,
  useProfile,
} from '@/lib/hooks/account-queries';
import type { CompatibilityInputValues } from '@/lib/schemas/compatibility';
import type { CompatibilityResult } from '@/lib/types/compatibility';
import { getApiErrorMessage } from '@/lib/utils/api-error';

export default function CompatibilityPage() {
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { data: activeResume, isLoading: isResumeLoading } = useActiveResume();

  const [tab, setTab] = useState('new');
  // History isn't needed to run an analysis, so it's only fetched the
  // first time the History tab is opened (and then kept in cache).
  const [historyRequested, setHistoryRequested] = useState(false);
  const [activeResult, setActiveResult] = useState<CompatibilityResult | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const [analyze, { isLoading: isAnalyzing }] = useAnalyzeCompatibilityMutation();
  const [deleteAnalysis] = useDeleteCompatibilityAnalysisMutation();

  const {
    data: history = [],
    isLoading: isHistoryLoading,
    isError: isHistoryError,
    refetch: refetchHistory,
  } = useCompatibilityHistory({ skip: !historyRequested });

  if (isProfileLoading || isResumeLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Compatibility"
          description="See how your verified profile matches a target role."
        />
        <ProcessingState
          title="Loading your profile…"
          description="One moment."
        />
      </div>
    );
  }

  const latestVersion = activeResume?.versions[0];

  // Analysis needs a verified profile.
  if (!profile) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Compatibility"
          description="See how your verified profile matches a target role."
        />

        <EmptyState
          icon={UserRound}
          title="Verify your profile first"
          description="Compatibility checks run against your confirmed profile. Upload and confirm your resume to get started."
          action={
            <Button render={<Link href="/profile" />}>
              Go to profile
            </Button>
          }
        />
      </div>
    );
  }

const resumeVersionId = latestVersion?.id;
const verifiedValues = latestVersion
  ? toProfileReviewValues(latestVersion, profile)
  : null;

  async function handleAnalyze(values: CompatibilityInputValues) {
    setError(null);
      if (!resumeVersionId || !verifiedValues) {
    setError('Please upload and confirm your resume first.');
    return;
  }

    try {
      const result = await analyze({
        resumeVersionId,
        payload: toAnalyzeCompatibilityPayload(verifiedValues, {
          targetRole: values.targetRole,
          jobDescription: values.jobDescription,
        }),
      }).unwrap();

      // Show the newly created result immediately.
      setActiveResult(result);
      setTab('new');

      // The mutation invalidates the history tag, so a loaded history
      // refetches by itself — no explicit refetch needed.
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not run the analysis.'));
    }
  }

  async function handleDeleteAnalysis(analysisId: string) {
    await deleteAnalysis(analysisId).unwrap();

    // Don't keep showing a result the user just deleted.
    if (activeResult?.id === analysisId) {
      setActiveResult(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compatibility"
        description="See how your verified profile matches a target role."
      />

      <Tabs
        value={tab}
        onValueChange={(next) => {
          setTab(next);
          if (next === 'history') setHistoryRequested(true);
        }}
      >
        <TabsList>
          <TabsTrigger value="new">New analysis</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-4 space-y-4">
          {error ? (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          ) : null}

          {isAnalyzing ? (
            <ProcessingState
              title="Analyzing your match…"
              description="Comparing your verified profile against the job description. This can take a few seconds."
            />
          ) : activeResult ? (
            <CompatibilityResultView
              result={activeResult}
              onRunAnother={() => setActiveResult(null)}
            />
          ) : (
            <CompatibilityInputForm
              onSubmit={handleAnalyze}
              defaultTargetRole={profile.targetRole ?? ''}
              isSubmitting={isAnalyzing}
            />
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          {isHistoryLoading ? (
            <ProcessingState
              title="Loading history…"
              description="Fetching your previous compatibility analyses."
            />
          ) : isHistoryError ? (
            <div className="space-y-3">
              <p
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                Could not load your compatibility history.
              </p>

              <Button variant="outline" onClick={() => refetchHistory()}>
                Try again
              </Button>
            </div>
          ) : (
            <CompatibilityHistoryList
              history={history}
              onDelete={handleDeleteAnalysis}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
