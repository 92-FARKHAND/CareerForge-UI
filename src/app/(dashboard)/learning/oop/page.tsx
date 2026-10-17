import { Layers } from 'lucide-react';

import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';

export default function OopLearningPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Object-Oriented Programming"
        description="Work through classes, interfaces, and design patterns with short modules built around real examples."
      />
      <EmptyState
        icon={Layers}
        title="OOP modules are coming soon"
        description="This track will be built out once the learning content schema and backend contracts are in place."
      />
    </div>
  );
}
