import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Wrench, AlertTriangle, Droplets, Lightbulb } from 'lucide-react';
import { aiService } from '@/services/settingsService';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/Loader';
import type { AIInsight } from '@/types';

const typeIcons: Record<string, React.ElementType> = {
  leak: Droplets,
  demand: TrendingUp,
  maintenance: Wrench,
  failure: AlertTriangle,
  water_loss: Droplets,
};

const typeColors: Record<string, string> = {
  leak: '#EF4444',
  demand: '#2563EB',
  maintenance: '#F59E0B',
  failure: '#EF4444',
  water_loss: '#06B6D4',
};

export default function AIInsightsPage() {
  const { data: insights, isLoading } = useQuery({
    queryKey: ['ai-insights'],
    queryFn: aiService.getInsights,
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Insights</h1>
          <p className="text-sm text-slate-500">Machine learning predictions and recommendations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {insights?.map((insight, i) => (
          <InsightCard key={insight.id} insight={insight} index={i} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-warning" />Recommendations Summary</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {insights?.map((insight) => (
            <div key={insight.id} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
              <Badge variant="primary">{insight.confidence}% confidence</Badge>
              <div>
                <p className="font-medium">{insight.recommendation}</p>
                <p className="text-sm text-slate-500">Impact: {insight.impact} | Timeframe: {insight.timeframe}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function InsightCard({ insight, index }: { insight: AIInsight; index: number }) {
  const Icon = typeIcons[insight.type] ?? Brain;
  const color = typeColors[insight.type] ?? '#2563EB';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card hover>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}15` }}>
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">{insight.title}</CardTitle>
            <CardDescription className="mt-1">{insight.prediction}</CardDescription>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-slate-500">Confidence</span>
            <span className="font-bold" style={{ color }}>{insight.confidence}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${insight.confidence}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>
        </div>
        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800/50">
          <p className="font-medium text-slate-700 dark:text-slate-300">{insight.recommendation}</p>
        </div>
      </Card>
    </motion.div>
  );
}
