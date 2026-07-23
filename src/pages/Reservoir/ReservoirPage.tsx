import { useQuery } from '@tanstack/react-query';
import { Waves, AlertTriangle, Droplets, CloudRain } from 'lucide-react';
import { reservoirService } from '@/services/settingsService';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { ChartArea } from '@/components/charts/LineChart';
import { PageLoader } from '@/components/ui/Loader';
import { formatNumber, formatPercent } from '@/utils';

export default function ReservoirPage() {
  const { data: reservoirs, isLoading } = useQuery({
    queryKey: ['reservoirs'],
    queryFn: reservoirService.getAll,
  });

  const { data: history } = useQuery({
    queryKey: ['reservoir-history'],
    queryFn: reservoirService.getHistory,
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reservoir Monitoring</h1>
        <p className="text-sm text-slate-500">Track water levels, capacity, and pump operations</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reservoirs?.map((res) => {
          const levelPercent = (res.currentLevel / res.capacity) * 100;
          return (
            <Card key={res.id} hover>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10">
                    <Waves className="h-5 w-5 text-cyan" />
                  </div>
                  <div>
                    <p className="font-semibold">{res.name}</p>
                    <p className="text-xs text-slate-500">{res.id}</p>
                  </div>
                </div>
                {res.overflowWarning && (
                  <AlertTriangle className="h-5 w-5 text-warning" aria-label="Overflow warning" />
                )}
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Water Level</span>
                  <span className="font-bold">{formatPercent(levelPercent)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${levelPercent}%`,
                      backgroundColor: levelPercent > 90 ? '#EF4444' : levelPercent > 70 ? '#22C55E' : '#2563EB',
                    }}
                  />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                    <p className="text-slate-400">Current</p>
                    <p className="font-semibold">{formatNumber(res.currentLevel)} L</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                    <p className="text-slate-400">Capacity</p>
                    <p className="font-semibold">{formatNumber(res.capacity)} L</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <CloudRain className="h-3 w-3" />
                    Rainwater: {formatNumber(res.rainwaterHarvesting)} L
                  </div>
                  <StatusBadge status={res.pumpStatus} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Droplets className="h-5 w-5 text-primary" />Historical Level Chart</CardTitle></CardHeader>
        {history && (
          <ChartArea
            data={history}
            xKey="date"
            areas={[
              { key: 'level', color: '#2563EB', name: 'Level %' },
              { key: 'inflow', color: '#22C55E', name: 'Inflow' },
              { key: 'outflow', color: '#F59E0B', name: 'Outflow' },
            ]}
            height={350}
          />
        )}
      </Card>
    </div>
  );
}
