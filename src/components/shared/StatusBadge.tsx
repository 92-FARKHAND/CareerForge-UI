import { CheckCircle2, Circle, PenLine } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

export type ResumeStatus =
  | 'not_uploaded'
  | 'needs_review'
  | 'verified';

const statusConfig: Record<
  ResumeStatus,
  {
    label: string;
    variant: 'default' | 'secondary' | 'outline';
    icon: typeof Circle;
  }
> = {
  not_uploaded: { label: 'Not started', variant: 'outline', icon: Circle },
  needs_review: { label: 'Needs review', variant: 'default', icon: PenLine },
  verified: { label: 'Verified', variant: 'default', icon: CheckCircle2 },
};

export function ResumeStatusBadge({ status }: { status: ResumeStatus }) {
  const { label, variant, icon: Icon } = statusConfig[status];

  return (
    <Badge variant={variant}>
      <Icon />
      {label}
    </Badge>
  );
}
