import { ClipboardCheck } from 'lucide-react';

import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';

export default function AssessmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessments"
        description="Timed, role-specific tests with instant scoring."
      />
      <EmptyState
        icon={ClipboardCheck}
        title="Assessments isn't built yet"
        description="This is a planned area of CareerForge. It'll be implemented once assessment content and scoring contracts are defined with the backend."
      />
    </div>
  );
}
