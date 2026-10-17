import { Briefcase } from 'lucide-react';

import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Jobs"
        description="Listings ranked by your compatibility score, not by how recently they were posted."
      />
      <EmptyState
        icon={Briefcase}
        title="Jobs isn't built yet"
        description="This is a planned area of CareerForge. It'll be implemented once job listing and application contracts are defined with the backend."
      />
    </div>
  );
}
