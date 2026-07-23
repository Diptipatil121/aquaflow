import { cn } from '@/utils';

const badgeVariants = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
  cyan: 'bg-cyan/10 text-cyan',
  slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: keyof typeof badgeVariants;
  className?: string;
  dot?: boolean;
}

export function Badge({ children, variant = 'primary', className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        badgeVariants[variant],
        className
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', `bg-current`)} aria-hidden="true" />}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, keyof typeof badgeVariants> = {
    active: 'success', online: 'success', normal: 'success', resolved: 'success', paid: 'success',
    warning: 'warning', pending: 'warning', maintenance: 'warning',
    critical: 'danger', offline: 'danger', leak: 'danger', overdue: 'danger', inactive: 'slate',
  };
  return (
    <Badge variant={variantMap[status.toLowerCase()] ?? 'primary'} dot>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
