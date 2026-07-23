import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle, UserPlus, Trash2 } from 'lucide-react';
import { alertService } from '@/services/settingsService';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { Timeline } from '@/components/ui/Timeline';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Modal';
import { PageLoader } from '@/components/ui/Loader';
import { formatDateTime } from '@/utils';
import type { Alert } from '@/types';

export default function AlertsPage() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: alerts, isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: alertService.getAll,
  });

  const resolveMutation = useMutation({
    mutationFn: alertService.resolve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast.success('Alert resolved');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: alertService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast.success('Alert deleted');
      setDeleteId(null);
    },
  });

  if (isLoading) return <PageLoader />;

  const critical = alerts?.filter((a) => a.severity === 'critical' || a.type === 'critical') ?? [];
  const warnings = alerts?.filter((a) => a.severity !== 'critical' && a.type !== 'critical') ?? [];

  const AlertCard = ({ alert }: { alert: Alert }) => (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 p-4 dark:border-slate-800">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Badge variant={alert.severity === 'critical' ? 'danger' : alert.severity === 'high' ? 'warning' : 'primary'}>
            {alert.type.replace('_', ' ')}
          </Badge>
          <StatusBadge status={alert.status} />
        </div>
        <p className="mt-2 font-medium">{alert.title}</p>
        <p className="text-sm text-slate-500">{alert.message}</p>
        <p className="mt-1 text-xs text-slate-400">{formatDateTime(alert.timestamp)} | Source: {alert.source}</p>
      </div>
      <div className="flex shrink-0 gap-1">
        {alert.status !== 'resolved' && (
          <Button variant="ghost" size="icon" onClick={() => resolveMutation.mutate(alert.id)} aria-label="Resolve">
            <CheckCircle className="h-4 w-4 text-success" />
          </Button>
        )}
        <Button variant="ghost" size="icon" aria-label="Assign"><UserPlus className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(alert.id)} aria-label="Delete">
          <Trash2 className="h-4 w-4 text-danger" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Alerts</h1>
        <p className="text-sm text-slate-500">Monitor and manage system alerts and notifications</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-danger" />
              Critical Alerts ({critical.length})
            </CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {critical.map((a) => <AlertCard key={a.id} alert={a} />)}
            {critical.length === 0 && <p className="text-center text-sm text-slate-400 py-8">No critical alerts</p>}
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Alert Timeline</CardTitle></CardHeader>
          <Timeline
            items={(alerts ?? []).map((a) => ({
              id: a.id,
              title: a.title,
              description: a.message.slice(0, 60),
              timestamp: a.timestamp,
              status: a.severity === 'critical' ? 'danger' : a.severity === 'high' ? 'warning' : 'info',
            }))}
          />
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Warning Alerts ({warnings.length})</CardTitle></CardHeader>
        <div className="space-y-3">
          {warnings.map((a) => <AlertCard key={a.id} alert={a} />)}
        </div>
      </Card>

      <Dialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Alert"
        message="Are you sure you want to delete this alert?"
        confirmLabel="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
