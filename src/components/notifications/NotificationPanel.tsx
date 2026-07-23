import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, AlertTriangle, FlaskConical, FileText, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/utils';
import { useNotifications, type AppNotification, type NotificationSeverity } from '@/context/NotificationContext';
import { formatRelativeTime } from '@/utils/formatRelativeTime';

type TabFilter = 'all' | 'alerts' | 'system';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const severityConfig: Record<
  NotificationSeverity,
  {
    label: string;
    card: string;
    badge: string;
    time: string;
    resolveBtn: string;
    assignBtn: string;
    icon: React.ReactNode;
  }
> = {
  critical: {
    label: 'CRITICAL',
    card: 'bg-red-50 border-red-100 dark:bg-red-950/30 dark:border-red-900/50',
    badge: 'text-red-600',
    time: 'text-red-500',
    resolveBtn: 'bg-red-600 hover:bg-red-700 text-white',
    assignBtn: 'border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/50',
    icon: <span className="text-lg" aria-hidden="true">🚨</span>,
  },
  high: {
    label: 'HIGH',
    card: 'bg-amber-50 border-amber-100 dark:bg-amber-950/30 dark:border-amber-900/50',
    badge: 'text-amber-600',
    time: 'text-amber-500',
    resolveBtn: 'bg-amber-500 hover:bg-amber-600 text-white',
    assignBtn: 'border-amber-300 text-amber-600 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-950/50',
    icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  },
  medium: {
    label: 'MEDIUM',
    card: 'bg-cyan-50 border-cyan-100 dark:bg-cyan-950/30 dark:border-cyan-900/50',
    badge: 'text-cyan-600',
    time: 'text-cyan-500',
    resolveBtn: 'bg-cyan-500 hover:bg-cyan-600 text-white',
    assignBtn: 'border-cyan-300 text-cyan-600 hover:bg-cyan-50 dark:border-cyan-800 dark:hover:bg-cyan-950/50',
    icon: <FlaskConical className="h-4 w-4 text-cyan-500" />,
  },
  low: {
    label: 'LOW',
    card: 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700',
    badge: 'text-slate-500',
    time: 'text-slate-400',
    resolveBtn: 'bg-slate-600 hover:bg-slate-700 text-white',
    assignBtn: 'border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800',
    icon: <FileText className="h-4 w-4 text-slate-500" />,
  },
};

function getNotificationIcon(notification: AppNotification) {
  if (notification.severity === 'critical') return severityConfig.critical.icon;
  if (notification.title.includes('Offline')) {
    return <span className="text-base" aria-hidden="true">📡</span>;
  }
  if (notification.title.includes('Quality')) {
    return <FlaskConical className="h-4 w-4 text-cyan-500" />;
  }
  if (notification.severity === 'high') {
    return <AlertTriangle className="h-4 w-4 text-amber-500" />;
  }
  return severityConfig[notification.severity].icon;
}

function NotificationCard({
  notification,
  onResolve,
  onAssign,
}: {
  notification: AppNotification;
  onResolve: (id: string) => void;
  onAssign: (id: string) => void;
}) {
  const config = severityConfig[notification.severity];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      className={cn(
        'rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md',
        config.card,
        !notification.read && 'ring-2 ring-blue-100'
    )}    >
      <div className="flex items-start gap-2">
      <div className="mt-1 shrink-0 text-xl">{getNotificationIcon(notification)}</div>
        <div className="min-w-0 flex-1">
          <span className={cn('text-[11px] font-bold tracking-wide', config.badge)}>
            {config.label}
          </span>
          <h4 className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">            {notification.title}
          </h4>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">            {notification.message}
          </p>
          <p className={cn('mt-2 text-xs font-medium', config.time)}>
            {formatRelativeTime(notification.timestamp)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => onResolve(notification.id)}
          className={cn(
            'flex-1 rounded-xl px-5 py-3 text-sm font-semibold',
            config.resolveBtn
          )}
        >
          Resolve
        </button>
        <button
          type="button"
          onClick={() => onAssign(notification.id)}
          className={cn(
            'flex-1 rounded-xl border bg-white/60 px-5 py-3 text-sm font-semibold',
            config.assignBtn
          )}
        >
          Assign
        </button>
      </div>
    </motion.div>
  );
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, unreadCount, markAllAsRead, resolveNotification, markAsRead } =
    useNotifications();
  const [activeTab, setActiveTab] = useState<TabFilter>('all');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const filtered = notifications.filter((n) => {
    if (activeTab === 'alerts') return n.category === 'alert';
    if (activeTab === 'system') return n.category === 'system';
    return true;
  });

  const tabs: { id: TabFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'system', label: 'System' },
  ];

  const handleResolve = (id: string) => {
    resolveNotification(id);
    toast.success('Alert resolved');
  };

  const handleAssign = (id: string) => {
    markAsRead(id);
    toast.info('Alert assigned to engineer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 z-50 flex h-screen w-full max-w-[680px] flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"            role="dialog"
            aria-modal="true"
            aria-label="Notifications"
          >
            {/* Header */}
            <div className="border-b border-slate-200 bg-white px-8 py-6 dark:border-slate-800 dark:bg-slate-900">              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Notifications
                  </h2>
                  <p className="mt-0.5 text-sm text-slate-400">
                    {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:hover:bg-blue-950"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                    aria-label="Close notifications"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div
    className="mt-6 flex gap-8 border-b border-slate-200 pb-2"
    role="tablist">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'pb-3 text-sm font-medium transition-colors',
                      activeTab === tab.id
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'border-b-2 border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification list */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <AnimatePresence mode="popLayout">
                {filtered.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <Bell className="mb-3 h-10 w-10 text-slate-300" />
                    <p className="text-sm font-medium text-slate-500">No notifications</p>
                    <p className="mt-1 text-xs text-slate-400">You&apos;re all caught up!</p>
                  </motion.div>
                ) : (
                  <div className="space-y-5">
                    {filtered.map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onResolve={handleResolve}
                        onAssign={handleAssign}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
