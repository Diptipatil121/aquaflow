import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/sensorService';
import { MetricCard } from '@/components/cards/MetricCard';
import { WaterMap } from '@/components/map/WaterMap';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Loader';
import { MapPin } from 'lucide-react';

export default function DashboardPage() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: dashboardService.getMetrics,
  });

  const { data: markers, isLoading: mapLoading } = useQuery({
    queryKey: ['map-markers'],
    queryFn: dashboardService.getMapMarkers,
  });

  if (metricsLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-slate-500">Real-time overview of your water distribution network</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics?.map((metric, i) => (
          <MetricCard key={metric.id} metric={metric} index={i} />
        ))}
      </div>

      <Card glass={false} className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Network Map
          </CardTitle>
        </CardHeader>
        {!mapLoading && markers && <WaterMap markers={markers} height="500px" />}
      </Card>
    </div>
  );
}
