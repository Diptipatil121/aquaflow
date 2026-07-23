import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { CHART_COLOR_ARRAY } from '@/utils/constants';

interface PieChartProps {
  data: { name: string; value: number }[];
  height?: number;
  innerRadius?: number;
}

export function ChartPie({ data, height = 300, innerRadius = 0 }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLOR_ARRAY[i % CHART_COLOR_ARRAY.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ChartDonut(props: PieChartProps) {
  return <ChartPie {...props} innerRadius={60} />;
}
