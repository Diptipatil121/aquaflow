import { cn } from '@/utils';
import { formatDateTime } from '@/utils';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'danger' | 'info';
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const statusColors = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-primary',
};

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('relative space-y-0', className)} role="list">
      {items.map((item, i) => (
        <div key={item.id} className="relative flex gap-4 pb-8 last:pb-0" role="listitem">
          {i < items.length - 1 && (
            <div className="absolute left-[11px] top-6 h-full w-0.5 bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
          )}
          <div
            className={cn(
              'relative z-10 mt-1 h-6 w-6 shrink-0 rounded-full border-2 border-white dark:border-slate-900',
              statusColors[item.status ?? 'info']
            )}
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.title}</p>
            {item.description && (
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
            )}
            <time className="mt-1 block text-xs text-slate-400">{formatDateTime(item.timestamp)}</time>
          </div>
        </div>
      ))}
    </div>
  );
}
