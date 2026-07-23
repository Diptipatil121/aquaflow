import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type NotificationSeverity = 'critical' | 'high' | 'medium' | 'low';
export type NotificationCategory = 'alert' | 'system';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  category: NotificationCategory;
  read: boolean;
  timestamp: string;
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<AppNotification, 'id' | 'read' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  resolveNotification: (id: string) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const initialNotifications: AppNotification[] = [
  {
    id: '1',
    title: 'Major Leak Detected',
    message: 'Zone 4B — Pipeline P-2241 pressure drop 38%',
    severity: 'critical',
    category: 'alert',
    read: false,
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Pressure Anomaly',
    message: 'Sensor S-118 reporting 8.2 bar (threshold: 7.5)',
    severity: 'high',
    category: 'alert',
    read: false,
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Sensor Offline',
    message: 'IoT node SN-0047 has lost connectivity',
    severity: 'high',
    category: 'alert',
    read: false,
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Quality Warning',
    message: 'Chlorine level 0.3 mg/L in Sector 7 (min: 0.5)',
    severity: 'medium',
    category: 'alert',
    read: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    title: 'Daily Report Ready',
    message: 'Your daily water distribution report is available for download',
    severity: 'low',
    category: 'system',
    read: false,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    title: 'Pump Maintenance Complete',
    message: 'Pump station PMP-003 service completed successfully',
    severity: 'low',
    category: 'system',
    read: false,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    title: 'Reservoir Level Low',
    message: 'Reservoir Beta at 35% capacity — consider increasing inflow',
    severity: 'medium',
    category: 'alert',
    read: false,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '8',
    title: 'System Update',
    message: 'AquaFlow v2.1.0 is available with improved AI predictions',
    severity: 'low',
    category: 'system',
    read: true,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const addNotification = useCallback(
    (notification: Omit<AppNotification, 'id' | 'read' | 'timestamp'>) => {
      setNotifications((prev) => [
        {
          ...notification,
          id: Date.now().toString(),
          read: false,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const resolveNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      resolveNotification,
      removeNotification,
      clearAll,
    }),
    [notifications, unreadCount, addNotification, markAsRead, markAllAsRead, resolveNotification, removeNotification, clearAll]
  );

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
}
