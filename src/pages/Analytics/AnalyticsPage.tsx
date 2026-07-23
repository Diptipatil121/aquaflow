import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analyticsService';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { ChartLine, ChartArea } from '@/components/charts/LineChart';
import { ChartBar } from '@/components/charts/BarChart';
import { ChartPie, ChartDonut } from '@/components/charts/PieChart';
import { PageLoader } from '@/components/ui/Loader';
import { CHART_COLORS } from '@/utils/constants';
import { formatNumber, formatCurrency } from '@/utils';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AnalyticsPage() {
  const { data: daily, isLoading } = useQuery({
    queryKey: ['analytics-daily'],
    queryFn: () => analyticsService.getDaily(30),
  });

  const { data: monthly } = useQuery({
    queryKey: ['analytics-monthly'],
    queryFn: analyticsService.getMonthly,
  });

  const { data: zones } = useQuery({
    queryKey: ['zone-distribution'],
    queryFn: analyticsService.getZoneDistribution,
  });

  const { data: summary } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: analyticsService.getSummary,
  });

  if (isLoading) return <PageLoader />;

  const recentDaily = daily?.slice(-14) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-slate-500">Comprehensive water distribution analytics and insights</p>
        </div>
        <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Export Data</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Consumption', value: formatNumber(summary?.totalConsumption ?? 0), unit: 'L' },
          { label: 'Avg Pressure', value: (summary?.avgPressure ?? 0).toFixed(1), unit: 'bar' },
          { label: 'Water Saved', value: formatNumber(summary?.waterSaved ?? 0), unit: 'L' },
          { label: 'Revenue Saved', value: formatCurrency(summary?.revenueSaved ?? 0), unit: '' },
        ].map((s) => (
          <Card key={s.label} hover>
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="text-2xl font-bold">{s.value} <span className="text-sm font-normal text-slate-400">{s.unit}</span></p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Daily Consumption</CardTitle></CardHeader>
          <ChartArea data={recentDaily} xKey="date" areas={[{ key: 'consumption', color: CHART_COLORS.primary, name: 'Consumption (L)' }]} />
        </Card>
        <Card>
          <CardHeader><CardTitle>Monthly Consumption</CardTitle></CardHeader>
          {monthly && <ChartBar data={monthly} xKey="month" bars={[{ key: 'consumption', color: CHART_COLORS.primary }, { key: 'forecast', color: CHART_COLORS.cyan, name: 'Forecast' }]} />}
        </Card>
        <Card>
          <CardHeader><CardTitle>Pressure Trends</CardTitle></CardHeader>
          <ChartLine data={recentDaily} xKey="date" lines={[{ key: 'pressure', color: CHART_COLORS.cyan, name: 'Pressure (bar)' }]} />
        </Card>
        <Card>
          <CardHeader><CardTitle>Leak Frequency</CardTitle></CardHeader>
          <ChartBar data={recentDaily} xKey="date" bars={[{ key: 'leaks', color: CHART_COLORS.danger, name: 'Leaks' }]} />
        </Card>
        <Card>
          <CardHeader><CardTitle>Zone Distribution</CardTitle></CardHeader>
          {zones && <ChartPie data={zones} height={280} />}
        </Card>
        <Card>
          <CardHeader><CardTitle>Quality vs Consumption</CardTitle></CardHeader>
          <ChartDonut data={[
            { name: 'Quality Score', value: summary ? Math.round(summary.avgPressure * 20) : 85 },
            { name: 'Efficiency', value: 15 },
          ]} height={280} />
        </Card>
      </div>
    </div>
  );
}
