import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { CHART_COLORS } from '@/utils/constants';

interface BarChartProps {
  data: object[];
  xKey: string;
  bars: { key: string; color?: string; name?: string }[];
  height?: number;
}

export function ChartBar({ data, xKey, bars, height = 300 }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
        <Legend />
        {bars.map((bar, i) => (
          <Bar key={bar.key} dataKey={bar.key} fill={bar.color ?? CHART_COLORS[Object.keys(CHART_COLORS)[i % 6] as keyof typeof CHART_COLORS]} radius={[6, 6, 0, 0]} name={bar.name ?? bar.key} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
