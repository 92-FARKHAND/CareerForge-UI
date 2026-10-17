import { ChangePasswordForm } from '@/components/settings/ChangePasswordForm';
import { PageHeader } from '@/components/shared/PageHeader';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account security."
      />
      <ChangePasswordForm />
    </div>
  );
}
