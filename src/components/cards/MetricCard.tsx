import { cn } from '@/utils';
import { motion } from 'framer-motion';
import {
  Droplets, Gauge, Waves, Radio, AlertTriangle, BarChart3, FlaskConical, Brain,
  type LucideIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Sparkline } from '@/components/charts/LineChart';
import { useAnimatedNumber } from '@/hooks';
import { formatNumber } from '@/utils';
import type { DashboardMetric } from '@/types';

const iconMap: Record<string, LucideIcon> = {
  supply: Droplets,
  pressure: Gauge,
  reservoir: Waves,
  sensors: Radio,
  leaks: AlertTriangle,
  consumption: BarChart3,
  quality: FlaskConical,
  ai: Brain,
};

const colorMap: Record<string, string> = {
  supply: '#2563EB',
  pressure: '#06B6D4',
  reservoir: '#22C55E',
  sensors: '#8B5CF6',
  leaks: '#EF4444',
  consumption: '#2563EB',
  quality: '#22C55E',
  ai: '#F59E0B',
};

interface MetricCardProps {
  metric: DashboardMetric;
  index?: number;
}

export function MetricCard({ metric, index = 0 }: MetricCardProps) {
  const Icon = iconMap[metric.id] ?? Droplets;
  const color = colorMap[metric.id] ?? '#2563EB';
  const animatedValue = useAnimatedNumber(metric.value, 1200);
  const isPositive = metric.change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Card hover className="relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
          <StatusBadge status={metric.status} />
        </div>
        <div className="mt-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">{metric.title}</p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold">
              {metric.unit === 'L' || metric.unit === 'm³'
                ? formatNumber(Math.round(animatedValue))
                : metric.unit === 'bar' || metric.unit === 'score'
                ? animatedValue.toFixed(1)
                : Math.round(animatedValue)}
            </span>
            {metric.unit !== '/50' && metric.unit !== 'active' && (
              <span className="text-sm text-slate-400">{metric.unit}</span>
            )}
            {metric.unit === '/50' && <span className="text-sm text-slate-400">/50</span>}
            {metric.unit === 'active' && <span className="text-sm text-slate-400">active</span>}
          </div>
          <p className={cn('mt-1 text-xs font-medium', isPositive ? 'text-success' : 'text-danger')}>
            {isPositive ? '+' : ''}{metric.change}% from yesterday
          </p>
        </div>
        <div className="mt-3 -mb-2">
          <Sparkline data={metric.sparkline} color={color} />
        </div>
      </Card>
    </motion.div>
  );
}
