import { CheckCircle2, RotateCcw } from 'lucide-react';

import { ScoreRing } from '@/components/shared/ScoreRing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { CompatibilityResult } from '@/lib/types/compatibility';

interface CompatibilityResultViewProps {
  result: CompatibilityResult;
  onRunAnother: () => void;
}

const SUB_SCORE_LABELS: Record<
  keyof Omit<CompatibilityResult['scores'], 'overall'>,
  string
> = {
  technical: 'Technical skills',
  experience: 'Experience',
  projects: 'Projects',
  tools: 'Tools',
  roleAlignment: 'Role alignment',
  education: 'Education',
};

export function CompatibilityResultView({
  result,
  onRunAnother,
}: CompatibilityResultViewProps) {
  const subScores = Object.entries(SUB_SCORE_LABELS) as [
    keyof typeof SUB_SCORE_LABELS,
    string,
  ][];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm text-muted-foreground">Match for</p>
            <h2 className="text-xl font-semibold tracking-tight">
              {result.targetRole ?? 'this role'}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {result.readinessLevel ? (
                <Badge>{result.readinessLevel}</Badge>
              ) : null}
              <p className="text-xs text-muted-foreground">
                Analyzed{' '}
                {new Date(result.createdAt).toLocaleDateString(undefined, {
                  dateStyle: 'medium',
                })}
              </p>
            </div>
          </div>
          <ScoreRing score={result.scores.overall ?? 0} label="overall" />
        </CardContent>
      </Card>

      {result.jobDescription ? (
        <Card>
          <CardHeader>
            <CardTitle>Job description</CardTitle>
            <CardDescription>What this match was calculated against.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-sm text-muted-foreground">
              {result.jobDescription}
            </p>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Score breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subScores.map(([key, label]) => {
            const value = result.scores[key];
            return (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span>{label}</span>
                  <span className="text-muted-foreground">
                    {value ?? '—'}
                  </span>
                </div>
                <Progress value={value ?? 0} />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {result.skills.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Skills recognized in the job description</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {result.skills.map((skill) => (
              <Badge
                key={skill.skillName}
                variant={skill.matchType === 'MATCHED' ? 'default' : 'outline'}
              >
                {skill.matchType === 'MATCHED' ? <CheckCircle2 /> : null}
                {skill.skillName}
              </Badge>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Strengths</CardTitle>
            <CardDescription>What&apos;s working in your favor.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
              {result.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gaps to close</CardTitle>
            <CardDescription>Where this role expects more.</CardDescription>
          </CardHeader>
          <CardContent>
            {result.weaknesses.length > 0 ? (
              <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
                {result.weaknesses.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No significant gaps found.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
            {result.recommendations.map((rec) => (
              <li key={rec}>{rec}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" onClick={onRunAnother}>
          <RotateCcw />
          Check another role
        </Button>
      </div>
    </div>
  );
}
