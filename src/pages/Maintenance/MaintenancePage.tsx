import { useQuery } from '@tanstack/react-query';
import { Calendar, Wrench, ClipboardList, Activity } from 'lucide-react';
import { maintenanceService } from '@/services/settingsService';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { Tabs } from '@/components/ui/Tabs';
import { PageLoader } from '@/components/ui/Loader';
import { formatDate } from '@/utils';
import type { MaintenanceTask } from '@/types';

export default function MaintenancePage() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['maintenance-tasks'],
    queryFn: maintenanceService.getTasks,
  });

  if (isLoading) return <PageLoader />;

  const engineers = [...new Set(tasks?.map((t) => t.assignedTo) ?? [])];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Maintenance</h1>
        <p className="text-sm text-slate-500">Engineer assignments, repairs, and equipment health</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: ClipboardList, label: 'Open Tasks', value: tasks?.filter((t) => t.status !== 'resolved').length ?? 0 },
          { icon: Wrench, label: 'In Progress', value: tasks?.filter((t) => t.status === 'active').length ?? 0 },
          { icon: Calendar, label: 'Scheduled', value: tasks?.filter((t) => t.status === 'pending').length ?? 0 },
          { icon: Activity, label: 'Engineers', value: engineers.length },
        ].map((s) => (
          <Card key={s.label} hover>
            <div className="flex items-center gap-3">
              <s.icon className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-slate-500">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Tabs
        tabs={[
          {
            id: 'work-orders',
            label: 'Work Orders',
            content: (
              <Table<MaintenanceTask>
                data={tasks ?? []}
                columns={[
                  { key: 'id', label: 'ID' },
                  { key: 'title', label: 'Title' },
                  { key: 'type', label: 'Type', render: (t) => t.type.charAt(0).toUpperCase() + t.type.slice(1) },
                  { key: 'assignedTo', label: 'Assigned To' },
                  { key: 'priority', label: 'Priority', render: (t) => <StatusBadge status={t.priority} /> },
                  { key: 'status', label: 'Status', render: (t) => <StatusBadge status={t.status} /> },
                  { key: 'scheduledDate', label: 'Scheduled', render: (t) => formatDate(t.scheduledDate) },
                  { key: 'equipment', label: 'Equipment' },
                ]}
              />
            ),
          },
          {
            id: 'engineers',
            label: 'Engineers',
            content: (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {engineers.map((eng) => {
                  const engTasks = tasks?.filter((t) => t.assignedTo === eng) ?? [];
                  return (
                    <Card key={eng}>
                      <p className="font-semibold">{eng}</p>
                      <p className="text-sm text-slate-500">{engTasks.length} active tasks</p>
                      <div className="mt-2 space-y-1">
                        {engTasks.slice(0, 3).map((t) => (
                          <div key={t.id} className="flex items-center justify-between text-xs">
                            <span>{t.title}</span>
                            <StatusBadge status={t.status} />
                          </div>
                        ))}
                      </div>
                    </Card>
                  );
                })}
              </div>
            ),
          },
          {
            id: 'calendar',
            label: 'Calendar',
            content: (
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d} className="py-2 font-medium text-slate-500">{d}</div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const dayTasks = tasks?.filter((t) => new Date(t.scheduledDate).getDate() === (i % 28) + 1) ?? [];
                  return (
                    <div key={i} className="min-h-[60px] rounded-lg border border-slate-100 p-1 dark:border-slate-800">
                      <span className="text-slate-400">{(i % 28) + 1}</span>
                      {dayTasks.slice(0, 1).map((t) => (
                        <div key={t.id} className="mt-0.5 truncate rounded bg-primary/10 px-1 text-[10px] text-primary">{t.title}</div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
