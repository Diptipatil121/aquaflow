import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { CHART_COLORS } from '@/utils/constants';

interface GaugeProps {
  value: number;
  max?: number;
  label?: string;
  color?: string;
  height?: number;
}

export function GaugeChart({ value, max = 100, label, color = CHART_COLORS.primary, height = 160 }: GaugeProps) {
  const data = [{ name: label ?? 'Value', value, fill: color }];
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" barSize={12} data={data} startAngle={180} endAngle={0}>
          <PolarAngleAxis type="number" domain={[0, max]} angleAxisId={0} tick={false} />
          <RadialBar background dataKey="value" cornerRadius={6} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
        <span className="text-2xl font-bold">{value}</span>
        {label && <span className="text-xs text-slate-500">{label}</span>}
      </div>
    </div>
  );
}

interface SeverityMeterProps {
  severity: number;
  label?: string;
}

export function SeverityMeter({ severity, label = 'Leak Severity' }: SeverityMeterProps) {
  const color = severity > 75 ? CHART_COLORS.danger : severity > 50 ? CHART_COLORS.warning : CHART_COLORS.success;
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span style={{ color }}>{severity}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${severity}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
