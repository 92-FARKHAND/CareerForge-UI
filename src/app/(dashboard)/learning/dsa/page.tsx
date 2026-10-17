import { Binary } from 'lucide-react';

import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';

export default function DsaLearningPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Structures & Algorithms"
        description="Practice arrays, trees, and graphs with problems that adjust to what you got wrong last time."
      />
      <EmptyState
        icon={Binary}
        title="DSA modules are coming soon"
        description="This track will be built out once the learning content schema and backend contracts are in place."
      />
    </div>
  );
}
