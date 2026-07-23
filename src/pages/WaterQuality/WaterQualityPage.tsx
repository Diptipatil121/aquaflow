import { useQuery } from '@tanstack/react-query';
import { qualityService } from '@/services/analyticsService';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { GaugeChart } from '@/components/charts/GaugeChart';
import { ChartLine } from '@/components/charts/LineChart';
import { PageLoader } from '@/components/ui/Loader';
import { CHART_COLORS } from '@/utils/constants';
import { formatDateTime } from '@/utils';
import type { WaterQualityReading } from '@/types';

const qualityMetrics = [
  { key: 'ph' as const, label: 'pH Level', color: CHART_COLORS.primary },
  { key: 'tds' as const, label: 'TDS', color: CHART_COLORS.cyan, unit: 'ppm' },
  { key: 'temperature' as const, label: 'Temperature', color: CHART_COLORS.warning, unit: '°C' },
  { key: 'turbidity' as const, label: 'Turbidity', color: CHART_COLORS.purple, unit: 'NTU' },
  { key: 'chlorine' as const, label: 'Chlorine', color: CHART_COLORS.success, unit: 'mg/L' },
];

export default function WaterQualityPage() {
  const { data: readings, isLoading } = useQuery({
    queryKey: ['quality-readings'],
    queryFn: qualityService.getReadings,
  });

  if (isLoading) return <PageLoader />;

  const latest = readings?.[0];
  const trendData = readings?.slice(0, 14).reverse().map((r) => ({
    date: r.timestamp.split('T')[0],
    ph: r.ph,
    tds: r.tds,
    chlorine: r.chlorine,
  })) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Water Quality</h1>
        <p className="text-sm text-slate-500">Monitor water quality parameters and compliance</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {qualityMetrics.map((metric) => (
          <Card key={metric.key} hover className="text-center">
            <GaugeChart
              value={latest ? Math.round(latest[metric.key] * 10) / 10 : 0}
              max={metric.key === 'ph' ? 14 : metric.key === 'tds' ? 500 : metric.key === 'temperature' ? 40 : metric.key === 'turbidity' ? 10 : 5}
              label={metric.label}
              color={metric.color}
              height={120}
            />
            {metric.unit && <p className="text-xs text-slate-400">{metric.unit}</p>}
          </Card>
        ))}
        <Card hover className="text-center col-span-2 md:col-span-1">
          <GaugeChart
            value={latest?.qualityScore ?? 0}
            label="Quality Score"
            color={CHART_COLORS.success}
            height={120}
          />
          {latest && <StatusBadge status={latest.status} />}
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Quality Trends</CardTitle></CardHeader>
        <ChartLine
          data={trendData}
          xKey="date"
          lines={[
            { key: 'ph', color: CHART_COLORS.primary, name: 'pH' },
            { key: 'tds', color: CHART_COLORS.cyan, name: 'TDS' },
            { key: 'chlorine', color: CHART_COLORS.success, name: 'Chlorine' },
          ]}
        />
      </Card>

      <Card>
        <CardHeader><CardTitle>Historical Readings</CardTitle></CardHeader>
        <Table<WaterQualityReading>
          data={readings ?? []}
          columns={[
            { key: 'timestamp', label: 'Date', render: (r) => formatDateTime(r.timestamp) },
            { key: 'location', label: 'Location' },
            { key: 'ph', label: 'pH', render: (r) => r.ph.toFixed(2) },
            { key: 'tds', label: 'TDS', render: (r) => `${r.tds.toFixed(0)} ppm` },
            { key: 'temperature', label: 'Temp', render: (r) => `${r.temperature.toFixed(1)}°C` },
            { key: 'turbidity', label: 'Turbidity', render: (r) => `${r.turbidity.toFixed(2)} NTU` },
            { key: 'chlorine', label: 'Chlorine', render: (r) => `${r.chlorine.toFixed(2)} mg/L` },
            { key: 'qualityScore', label: 'Score', render: (r) => r.qualityScore.toFixed(0) },
            { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          ]}
        />
      </Card>
    </div>
  );
}
