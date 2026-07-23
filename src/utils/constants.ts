export const APP_NAME = 'AquaFlow';
export const APP_TAGLINE = 'Smart Water Distribution & Leakage Prevention';

export const STORAGE_KEYS = {
  TOKEN: 'aquaflow_token',
  USER: 'aquaflow_user',
  THEME: 'aquaflow_theme',
} as const;

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export const CHART_COLORS = {
  primary: '#2563EB',
  cyan: '#06B6D4',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
} as const;

export const CHART_COLOR_ARRAY = Object.values(CHART_COLORS);

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 10;

export const MAP_DEFAULT_CENTER: [number, number] = [28.6139, 77.209];
export const MAP_DEFAULT_ZOOM = 12;

export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/leak-detection', label: 'Leak Detection', icon: 'Droplets' },
  { path: '/distribution', label: 'Distribution', icon: 'GitBranch' },
  { path: '/reservoir', label: 'Reservoir', icon: 'Waves' },
  { path: '/water-quality', label: 'Water Quality', icon: 'FlaskConical' },
  { path: '/analytics', label: 'Analytics', icon: 'BarChart3' },
  { path: '/consumers', label: 'Consumers', icon: 'Users' },
  { path: '/reports', label: 'Reports', icon: 'FileText' },
  { path: '/maintenance', label: 'Maintenance', icon: 'Wrench' },
  { path: '/alerts', label: 'Alerts', icon: 'Bell' },
  { path: '/ai-insights', label: 'AI Insights', icon: 'Brain' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
] as const;

export const QUALITY_THRESHOLDS = {
  ph: { min: 6.5, max: 8.5, unit: '' },
  tds: { min: 0, max: 500, unit: 'ppm' },
  temperature: { min: 15, max: 25, unit: '°C' },
  turbidity: { min: 0, max: 5, unit: 'NTU' },
  chlorine: { min: 0.2, max: 4, unit: 'mg/L' },
} as const;

export const DEMO_CREDENTIALS = {
  email: 'admin@aquaflow.io',
  password: 'admin123',
} as const;
