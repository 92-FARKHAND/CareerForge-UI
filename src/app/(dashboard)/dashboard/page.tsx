'use client';

import Link from 'next/link';
import { CheckCircle2, Circle, FileText, Radar, Sparkles } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { ScoreRing } from '@/components/shared/ScoreRing';
import {
  ResumeStatusBadge,
  type ResumeStatus,
} from '@/components/shared/StatusBadge';
import { StatCard } from '@/components/shared/StatCard';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  useActiveResume,
  useCompatibilityHistory,
  useProfile,
} from '@/lib/hooks/account-queries';
import { useAppSelector } from '@/lib/hooks/redux';

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: profile } = useProfile();
  const { data: activeResume } = useActiveResume();
  const { data: history = [] } = useCompatibilityHistory();

  const latest = history[0] ?? null;
  const hasResume = Boolean(activeResume);
  const resumeStatus: ResumeStatus = profile
    ? 'verified'
    : hasResume
      ? 'needs_review'
      : 'not_uploaded';

  const steps = [
    {
      label: 'Upload your resume',
      done: hasResume,
      href: '/profile',
    },
    {
      label: 'Review and confirm your profile',
      done: Boolean(profile),
      href: '/profile',
    },
    {
      label: 'Run a compatibility check',
      done: history.length > 0,
      href: '/compatibility',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={
          user
            ? `Signed in as ${user.email}. Here's where you are.`
            : 'Your compatibility score, resume status, and recommended next steps at a glance.'
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Resume status</p>
              <div className="mt-1">
                <ResumeStatusBadge status={resumeStatus} />
              </div>
            </div>
            <FileText className="h-8 w-8 shrink-0 text-muted-foreground" />
          </CardContent>
        </Card>
        <StatCard
          icon={Sparkles}
          label="Skills on profile"
          value={profile ? String(profile.skills.length) : '—'}
        />
        <StatCard
          icon={Radar}
          label="Latest match score"
          value={
            latest?.overallScore != null ? `${latest.overallScore}/100` : 'Not run yet'
          }
          hint={latest?.targetRole ?? undefined}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Compatibility</CardTitle>
            <CardDescription>Your most recent role match.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 py-4">
            {latest?.overallScore != null ? (
              <>
                <ScoreRing score={latest.overallScore} label="overall" />
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href="/compatibility" />}
                >
                  View breakdown
                </Button>
              </>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Run a compatibility check to see a score here.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Getting started</CardTitle>
            <CardDescription>Three steps to your first match score.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {steps.map((step) => (
                <li key={step.label} className="flex items-center gap-3">
                  {step.done ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                  )}
                  <span
                    className={
                      step.done
                        ? 'text-sm text-muted-foreground line-through'
                        : 'text-sm'
                    }
                  >
                    {step.label}
                  </span>
                  {!step.done ? (
                    <Button
                      variant="link"
                      size="sm"
                      className="ml-auto"
                      render={<Link href={step.href} />}
                    >
                      Go
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
