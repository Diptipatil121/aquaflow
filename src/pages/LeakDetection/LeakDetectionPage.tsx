import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertOctagon, Brain, Activity } from 'lucide-react';
import { leakService, sensorService } from '@/services/sensorService';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import { Timeline } from '@/components/ui/Timeline';
import { Dialog } from '@/components/ui/Modal';
import { ChartLine } from '@/components/charts/LineChart';
import { SeverityMeter } from '@/components/charts/GaugeChart';
import { PageLoader } from '@/components/ui/Loader';
import { formatDateTime, formatNumber } from '@/utils';
import type { LeakEvent } from '@/types';

export default function LeakDetectionPage() {
  const [showShutdown, setShowShutdown] = useState(false);

  const { data: pressureData, isLoading: pLoading } = useQuery({
    queryKey: ['pressure-data'],
    queryFn: leakService.getPressureData,
  });

  const { data: flowData, isLoading: fLoading } = useQuery({
    queryKey: ['flow-data'],
    queryFn: leakService.getFlowData,
  });

  const { data: leaks, isLoading: lLoading } = useQuery({
    queryKey: ['leaks'],
    queryFn: leakService.getAll,
  });

  const { data: sensors } = useQuery({
    queryKey: ['sensors'],
    queryFn: sensorService.getAll,
  });

  const shutdownMutation = useMutation({
    mutationFn: leakService.emergencyShutdown,
    onSuccess: (data) => {
      toast.success(data.message);
      setShowShutdown(false);
    },
  });

  if (pLoading || fLoading || lLoading) return <PageLoader />;

  const onlineSensors = sensors?.filter((s) => s.status !== 'offline').length ?? 0;
  const avgSeverity = leaks?.reduce((s, l) => s + (l.severity === 'critical' ? 90 : l.severity === 'high' ? 70 : l.severity === 'medium' ? 50 : 30), 0) ?? 0;
  const severityScore = leaks?.length ? avgSeverity / leaks.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leak Detection</h1>
          <p className="text-sm text-slate-500">Monitor pipeline integrity and detect anomalies</p>
        </div>
        <Button variant="danger" onClick={() => setShowShutdown(true)}>
          <AlertOctagon className="h-4 w-4" /> Emergency Shutdown
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Pressure Monitoring</CardTitle></CardHeader>
          {pressureData && (
            <ChartLine
              data={pressureData}
              xKey="time"
              lines={[
                { key: 'pressure', color: '#2563EB', name: 'Pressure (bar)' },
                { key: 'threshold', color: '#EF4444', name: 'Threshold' },
              ]}
            />
          )}
        </Card>
        <Card>
          <CardHeader><CardTitle>Flow Rate Analysis</CardTitle></CardHeader>
          {flowData && (
            <ChartLine
              data={flowData}
              xKey="time"
              lines={[
                { key: 'flow', color: '#06B6D4', name: 'Actual Flow' },
                { key: 'predicted', color: '#F59E0B', name: 'Predicted' },
              ]}
            />
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-primary" />AI Prediction</CardTitle></CardHeader>
          <div className="space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-400">Next likely leak location: <strong>Sector 4, Pipeline PL-004</strong></p>
            <div className="flex items-center justify-between">
              <span className="text-sm">Confidence</span>
              <span className="text-lg font-bold text-primary">87%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
              <div className="h-full w-[87%] rounded-full bg-primary" />
            </div>
          </div>
        </Card>
        <Card>
          <CardHeader><CardTitle>Leak Severity</CardTitle></CardHeader>
          <SeverityMeter severity={Math.round(severityScore)} />
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-success" />Sensor Status</CardTitle></CardHeader>
          <div className="text-center">
            <p className="text-4xl font-bold text-success">{onlineSensors}</p>
            <p className="text-sm text-slate-500">of {sensors?.length ?? 0} sensors online</p>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Leak History</CardTitle></CardHeader>
        <Table<LeakEvent>
          data={leaks ?? []}
          columns={[
            { key: 'id', label: 'ID', sortable: true },
            { key: 'sensorId', label: 'Sensor' },
            { key: 'severity', label: 'Severity', render: (l) => <StatusBadge status={l.severity} /> },
            { key: 'pressureDrop', label: 'Pressure Drop', render: (l) => `${l.pressureDrop.toFixed(2)} bar` },
            { key: 'aiConfidence', label: 'AI Confidence', render: (l) => `${l.aiConfidence.toFixed(0)}%` },
            { key: 'estimatedLoss', label: 'Est. Loss', render: (l) => `${formatNumber(l.estimatedLoss)} L` },
            { key: 'status', label: 'Status', render: (l) => <StatusBadge status={l.status} /> },
            { key: 'detectedAt', label: 'Detected', render: (l) => formatDateTime(l.detectedAt) },
          ]}
        />
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent Leak Timeline</CardTitle></CardHeader>
        <Timeline
          items={(leaks ?? []).slice(0, 6).map((l) => ({
            id: l.id,
            title: `Leak ${l.id} - ${l.severity} severity`,
            description: `Sensor ${l.sensorId} | Loss: ${formatNumber(l.estimatedLoss)} L`,
            timestamp: l.detectedAt,
            status: l.severity === 'critical' ? 'danger' : l.severity === 'high' ? 'warning' : 'info',
          }))}
        />
      </Card>

      <Dialog
        isOpen={showShutdown}
        onClose={() => setShowShutdown(false)}
        onConfirm={() => shutdownMutation.mutate()}
        title="Emergency Shutdown"
        message="This will immediately close all distribution valves and stop all pumps. Are you sure?"
        confirmLabel="Initiate Shutdown"
        variant="danger"
        isLoading={shutdownMutation.isPending}
      />
    </div>
  );
}
