'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Radar } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  compatibilityInputSchema,
  type CompatibilityInputValues,
} from '@/lib/schemas/compatibility';

interface CompatibilityInputFormProps {
  onSubmit: (values: CompatibilityInputValues) => void;
  defaultTargetRole?: string;
  isSubmitting?: boolean;
}

export function CompatibilityInputForm({
  onSubmit,
  defaultTargetRole = '',
  isSubmitting = false,
}: CompatibilityInputFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompatibilityInputValues>({
    resolver: zodResolver(compatibilityInputSchema),
    defaultValues: { targetRole: defaultTargetRole, jobDescription: '' },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check your compatibility</CardTitle>
        <CardDescription>
          Paste a job description and we&apos;ll compare it against your
          verified profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="targetRole">Target role</Label>
            <Input
              id="targetRole"
              placeholder="e.g. Senior Frontend Engineer"
              aria-invalid={!!errors.targetRole}
              {...register('targetRole')}
            />
            {errors.targetRole ? (
              <p className="text-sm text-destructive">
                {errors.targetRole.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job description</Label>
            <Textarea
              id="jobDescription"
              rows={8}
              placeholder="Paste the full job posting here…"
              aria-invalid={!!errors.jobDescription}
              {...register('jobDescription')}
            />
            {errors.jobDescription ? (
              <p className="text-sm text-destructive">
                {errors.jobDescription.message}
              </p>
            ) : null}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              <Radar />
              {isSubmitting ? 'Analyzing…' : 'Check compatibility'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
