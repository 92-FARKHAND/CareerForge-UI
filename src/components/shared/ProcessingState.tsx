import { Loader2 } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

interface ProcessingStateProps {
  title: string;
  description: string;
}

export function ProcessingState({ title, description }: ProcessingStateProps) {
  return (
    <Card className="border-dashed shadow-none">
      <CardContent
        className="flex flex-col items-center gap-3 py-16 text-center"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="space-y-1">
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
