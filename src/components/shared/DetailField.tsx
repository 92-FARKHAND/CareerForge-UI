import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface DetailFieldProps {
  label: string;
  children?: ReactNode;
  className?: string;
}

/**
 * A titled read-only value. Must be rendered inside a <dl>. Empty values
 * show an em dash so every field is always visible, even when the
 * extraction left it blank.
 */
export function DetailField({ label, children, className }: DetailFieldProps) {
  const isEmpty =
    children === null ||
    children === undefined ||
    children === '' ||
    children === false;

  return (
    <div className={cn('space-y-1', className)}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="break-words text-sm">
        {isEmpty ? <span className="text-muted-foreground">—</span> : children}
      </dd>
    </div>
  );
}
