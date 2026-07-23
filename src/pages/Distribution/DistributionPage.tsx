import { useQuery } from '@tanstack/react-query';
import { GitBranch, Zap, Gauge, TrendingUp } from 'lucide-react';
import { distributionService } from '@/services/settingsService';
import { analyticsService } from '@/services/analyticsService';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { ChartBar } from '@/components/charts/BarChart';
import { PageLoader } from '@/components/ui/Loader';
import { formatNumber } from '@/utils';

export default function DistributionPage() {
  const { data: pipelines, isLoading: pLoading } = useQuery({
    queryKey: ['pipelines'],
    queryFn: distributionService.getPipelines,
  });

  const { data: pumps, isLoading: pumpLoading } = useQuery({
    queryKey: ['pumps'],
    queryFn: distributionService.getPumps,
  });

  const { data: monthly } = useQuery({
    queryKey: ['monthly-consumption'],
    queryFn: analyticsService.getMonthly,
  });

  if (pLoading || pumpLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Water Distribution</h1>
        <p className="text-sm text-slate-500">Pipeline network, valves, pumps, and flow management</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: GitBranch, label: 'Active Pipelines', value: pipelines?.filter((p) => p.status === 'active').length ?? 0, color: '#2563EB' },
          { icon: Gauge, label: 'Avg Pressure', value: `${((pipelines?.reduce((s, p) => s + p.pressure, 0) ?? 0) / (pipelines?.length ?? 1)).toFixed(1)} bar`, color: '#06B6D4' },
          { icon: Zap, label: 'Active Pumps', value: pumps?.filter((p) => p.status === 'active').length ?? 0, color: '#22C55E' },
          { icon: TrendingUp, label: 'Total Flow', value: `${formatNumber(pipelines?.reduce((s, p) => s + p.flow, 0) ?? 0)} L/min`, color: '#F59E0B' },
        ].map((stat) => (
          <Card key={stat.label} hover>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Pipeline Network</CardTitle></CardHeader>
          <div className="space-y-3">
            {pipelines?.map((pipe) => (
              <div key={pipe.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                <div>
                  <p className="font-medium">{pipe.name}</p>
                  <p className="text-xs text-slate-500">{pipe.length}m | {pipe.flow.toFixed(0)} L/min | {pipe.pressure.toFixed(1)} bar</p>
                </div>
                <StatusBadge status={pipe.status} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Valve Status</CardTitle></CardHeader>
          <div className="space-y-2">
            {pipelines?.flatMap((p) => p.valves).slice(0, 8).map((valve) => (
              <div key={valve.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/50">
                <span className="text-sm font-medium">{valve.name}</span>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${valve.openPercent}%` }} />
                  </div>
                  <StatusBadge status={valve.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Pump Status</CardTitle></CardHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {pumps?.map((pump) => (
              <div key={pump.id} className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{pump.name}</p>
                  <StatusBadge status={pump.status} />
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
                  <div><p className="text-slate-400">Flow</p><p className="font-semibold">{pump.flowRate.toFixed(0)}</p></div>
                  <div><p className="text-slate-400">Power</p><p className="font-semibold">{pump.power.toFixed(0)}kW</p></div>
                  <div><p className="text-slate-400">Eff.</p><p className="font-semibold">{pump.efficiency.toFixed(0)}%</p></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Demand Forecast</CardTitle></CardHeader>
          {monthly && (
            <ChartBar
              data={monthly}
              xKey="month"
              bars={[
                { key: 'consumption', color: '#2563EB', name: 'Actual' },
                { key: 'forecast', color: '#06B6D4', name: 'Forecast' },
              ]}
              height={280}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
