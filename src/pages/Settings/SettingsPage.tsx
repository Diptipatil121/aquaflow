import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { User, Bell, Gauge, Shield, Globe, Palette } from 'lucide-react';
import { useAuth, useTheme } from '@/context';
import { settingsService } from '@/services/settingsService';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { Avatar } from '@/components/ui/Avatar';
import { PageLoader } from '@/components/ui/Loader';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState<Record<string, boolean>>({});

  const { data: notifSettings, isLoading } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: settingsService.getNotifications,
  });

  const { data: thresholds } = useQuery({
    queryKey: ['thresholds'],
    queryFn: settingsService.getThresholds,
  });

  const updateNotifMutation = useMutation({
    mutationFn: settingsService.updateNotifications,
    onSuccess: () => toast.success('Notification settings saved'),
  });

  if (isLoading) return <PageLoader />;

  const notifState = { ...notifSettings, ...notifications };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-slate-500">Manage your account and system preferences</p>
      </div>

      <Tabs
        tabs={[
          {
            id: 'profile',
            label: 'Profile',
            content: (
              <Card>
                <div className="flex items-center gap-4 mb-6">
                  <Avatar name={user?.name ?? 'User'} size="lg" />
                  <div>
                    <p className="text-lg font-semibold">{user?.name}</p>
                    <p className="text-sm text-slate-500">{user?.email}</p>
                    <p className="text-xs text-primary capitalize">{user?.role}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input label="Full Name" defaultValue={user?.name} icon={<User className="h-4 w-4" />} />
                  <Input label="Email" defaultValue={user?.email} type="email" />
                  <Input label="Department" defaultValue={user?.department} />
                  <Input label="Phone" defaultValue={user?.phone} />
                </div>
                <Button className="mt-4">Save Profile</Button>
              </Card>
            ),
          },
          {
            id: 'notifications',
            label: 'Notifications',
            content: (
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />Notification Settings</CardTitle></CardHeader>
                <div className="space-y-4">
                  {Object.entries(notifState ?? {}).map(([key, value]) => (
                    <label key={key} className="flex items-center justify-between rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                      <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <input
                        type="checkbox"
                        checked={value as boolean}
                        onChange={(e) => setNotifications((prev) => ({ ...prev, [key]: e.target.checked }))}
                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                      />
                    </label>
                  ))}
                  <Button onClick={() => updateNotifMutation.mutate(notifState as never)}>Save Notifications</Button>
                </div>
              </Card>
            ),
          },
          {
            id: 'thresholds',
            label: 'Thresholds',
            content: (
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Gauge className="h-5 w-5" />Sensor Thresholds</CardTitle></CardHeader>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {thresholds && Object.entries(thresholds).map(([key, value]) => (
                    <Input key={key} label={key.replace(/([A-Z])/g, ' $1')} type="number" defaultValue={value} />
                  ))}
                </div>
                <Button className="mt-4">Save Thresholds</Button>
              </Card>
            ),
          },
          {
            id: 'theme',
            label: 'Theme',
            content: (
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" />Theme Settings</CardTitle></CardHeader>
                <div className="grid grid-cols-2 gap-4">
                  {(['light', 'dark'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`rounded-xl border-2 p-6 text-center transition-all ${theme === t ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700'}`}
                    >
                      <p className="font-medium capitalize">{t} Mode</p>
                    </button>
                  ))}
                </div>
              </Card>
            ),
          },
          {
            id: 'roles',
            label: 'Roles',
            content: (
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Role Management</CardTitle></CardHeader>
                <div className="space-y-3">
                  {['admin', 'operator', 'engineer', 'viewer'].map((role) => (
                    <div key={role} className="flex items-center justify-between rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                      <div>
                        <p className="font-medium capitalize">{role}</p>
                        <p className="text-xs text-slate-500">
                          {role === 'admin' ? 'Full system access' : role === 'operator' ? 'Monitor and control' : role === 'engineer' ? 'Maintenance tasks' : 'Read-only access'}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Edit Permissions</Button>
                    </div>
                  ))}
                </div>
              </Card>
            ),
          },
          {
            id: 'api',
            label: 'API',
            content: (
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" />API Configuration</CardTitle></CardHeader>
                <Input label="API Base URL" defaultValue="/api" />
                <Input label="API Key" type="password" defaultValue="••••••••••••" className="mt-4" />
                <Input label="Webhook URL" placeholder="https://your-server.com/webhook" className="mt-4" />
                <Button className="mt-4">Save API Settings</Button>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}
