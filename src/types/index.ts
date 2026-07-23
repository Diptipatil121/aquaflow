export type Status = 'active' | 'inactive' | 'warning' | 'critical' | 'offline' | 'maintenance' | 'resolved' | 'pending';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type BillingStatus = 'paid' | 'pending' | 'overdue';
export type AlertType = 'critical' | 'warning' | 'info' | 'maintenance' | 'sensor_offline' | 'pressure_drop' | 'quality';
export type UserRole = 'admin' | 'operator' | 'engineer' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface DashboardMetric {
  id: string;
  title: string;
  value: number;
  unit: string;
  change: number;
  status: Status;
  sparkline: number[];
}

export interface Sensor {
  id: string;
  name: string;
  type: 'pressure' | 'flow' | 'quality' | 'level' | 'temperature';
  location: GeoLocation;
  pressure: number;
  flow: number;
  temperature: number;
  battery: number;
  status: Status;
  lastUpdated: string;
  pipelineId?: string;
}

export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface Reservoir {
  id: string;
  name: string;
  location: GeoLocation;
  currentLevel: number;
  capacity: number;
  overflowWarning: boolean;
  pumpStatus: Status;
  rainwaterHarvesting: number;
  lastUpdated: string;
}

export interface LeakEvent {
  id: string;
  sensorId: string;
  location: GeoLocation;
  severity: Severity;
  pressureDrop: number;
  flowAnomaly: number;
  detectedAt: string;
  resolvedAt?: string;
  status: Status;
  aiConfidence: number;
  estimatedLoss: number;
}

export interface Consumer {
  id: string;
  name: string;
  address: string;
  usage: number;
  billingStatus: BillingStatus;
  leakReports: number;
  status: Status;
  zone: string;
  meterId: string;
}

export interface WaterQualityReading {
  id: string;
  timestamp: string;
  ph: number;
  tds: number;
  temperature: number;
  turbidity: number;
  chlorine: number;
  qualityScore: number;
  status: Status;
  location: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  severity: Severity;
  timestamp: string;
  status: Status;
  assignedTo?: string;
  source: string;
}

export interface AnalyticsDataPoint {
  date: string;
  consumption: number;
  pressure: number;
  leaks: number;
  quality: number;
  revenue: number;
  waterSaved: number;
}

export interface MapMarker {
  id: string;
  type: 'pipeline' | 'reservoir' | 'sensor' | 'tank' | 'consumer' | 'leak';
  position: [number, number];
  label: string;
  data?: Record<string, string | number>;
}

export interface Pipeline {
  id: string;
  name: string;
  status: Status;
  pressure: number;
  flow: number;
  length: number;
  valves: Valve[];
}

export interface Valve {
  id: string;
  name: string;
  status: Status;
  openPercent: number;
}

export interface Pump {
  id: string;
  name: string;
  status: Status;
  flowRate: number;
  power: number;
  efficiency: number;
}

export interface MaintenanceTask {
  id: string;
  title: string;
  type: 'repair' | 'inspection' | 'calibration' | 'replacement';
  assignedTo: string;
  priority: Severity;
  status: Status;
  scheduledDate: string;
  equipment: string;
}

export interface AIInsight {
  id: string;
  type: 'leak' | 'demand' | 'maintenance' | 'failure' | 'water_loss';
  title: string;
  prediction: string;
  confidence: number;
  recommendation: string;
  impact: string;
  timeframe: string;
}

export interface ReportConfig {
  id: string;
  name: string;
  type: 'daily' | 'monthly' | 'leak' | 'quality' | 'sensor';
  description: string;
  lastGenerated?: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  criticalAlerts: boolean;
  maintenanceReminders: boolean;
  dailyReports: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}
