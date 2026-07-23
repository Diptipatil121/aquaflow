import type {
  Sensor,
  Reservoir,
  LeakEvent,
  Consumer,
  WaterQualityReading,
  Alert,
  AnalyticsDataPoint,
  MapMarker,
  Pipeline,
  Pump,
  MaintenanceTask,
  AIInsight,
  DashboardMetric,
  Status,
  Severity,
  BillingStatus,
} from '@/types';

const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const randomInt = (min: number, max: number) =>
  Math.floor(randomBetween(min, max + 1));

const pick = <T>(arr: T[]): T => arr[randomInt(0, arr.length - 1)];

const statuses: Status[] = ['active', 'warning', 'critical', 'offline', 'maintenance'];
const severities: Severity[] = ['low', 'medium', 'high', 'critical'];
const billingStatuses: BillingStatus[] = ['paid', 'pending', 'overdue'];

const zones = ['North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone'];
const streets = ['Oak Ave', 'Maple St', 'River Rd', 'Lake View', 'Park Lane', 'Hill Top', 'Green Valley'];

const baseLat = 28.6139;
const baseLng = 77.209;

const generateLocation = (_index: number) => ({
  lat: baseLat + randomBetween(-0.08, 0.08),
  lng: baseLng + randomBetween(-0.08, 0.08),
  address: `${randomInt(100, 9999)} ${pick(streets)}, ${pick(zones)}`,
});

const generateSparkline = (base: number, variance: number, points = 12): number[] =>
  Array.from({ length: points }, (_, i) =>
    Math.max(0, base + Math.sin(i * 0.8) * variance + randomBetween(-variance * 0.3, variance * 0.3))
  );

export const mockSensors: Sensor[] = Array.from({ length: 50 }, (_, i) => {
  const types = ['pressure', 'flow', 'quality', 'level', 'temperature'] as const;
  const type = types[i % types.length];
  return {
    id: `SNR-${String(i + 1).padStart(4, '0')}`,
    name: `Sensor ${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1}`,
    type,
    location: generateLocation(i),
    pressure: randomBetween(2.5, 5.5),
    flow: randomBetween(100, 800),
    temperature: randomBetween(18, 28),
    battery: randomBetween(15, 100),
    status: pick(statuses),
    lastUpdated: new Date(Date.now() - randomInt(0, 3600000)).toISOString(),
    pipelineId: `PL-${String((i % 10) + 1).padStart(3, '0')}`,
  };
});

export const mockReservoirs: Reservoir[] = Array.from({ length: 10 }, (_, i) => {
  const capacity = randomInt(50000, 200000);
  const currentLevel = randomInt(capacity * 0.3, capacity * 0.95);
  return {
    id: `RSV-${String(i + 1).padStart(3, '0')}`,
    name: `Reservoir ${['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa'][i]}`,
    location: generateLocation(i),
    currentLevel,
    capacity,
    overflowWarning: currentLevel / capacity > 0.9,
    pumpStatus: pick(['active', 'maintenance', 'offline'] as Status[]),
    rainwaterHarvesting: randomBetween(500, 5000),
    lastUpdated: new Date().toISOString(),
  };
});

export const mockLeaks: LeakEvent[] = Array.from({ length: 20 }, (_, i) => ({
  id: `LEAK-${String(i + 1).padStart(4, '0')}`,
  sensorId: mockSensors[i % mockSensors.length].id,
  location: generateLocation(i),
  severity: pick(severities),
  pressureDrop: randomBetween(0.5, 3.0),
  flowAnomaly: randomBetween(10, 150),
  detectedAt: new Date(Date.now() - randomInt(0, 30 * 86400000)).toISOString(),
  resolvedAt: i % 3 === 0 ? new Date().toISOString() : undefined,
  status: i % 3 === 0 ? 'resolved' : pick(['active', 'warning', 'critical'] as Status[]),
  aiConfidence: randomBetween(75, 99),
  estimatedLoss: randomBetween(100, 10000),
}));

export const mockConsumers: Consumer[] = Array.from({ length: 100 }, (_, i) => ({
  id: `CON-${String(i + 1).padStart(5, '0')}`,
  name: `Consumer ${i + 1}`,
  address: generateLocation(i).address ?? '',
  usage: randomBetween(50, 500),
  billingStatus: pick(billingStatuses),
  leakReports: randomInt(0, 5),
  status: pick(['active', 'inactive', 'warning'] as Status[]),
  zone: pick(zones),
  meterId: `MTR-${String(i + 1).padStart(6, '0')}`,
}));

export const mockQualityReadings: WaterQualityReading[] = Array.from({ length: 30 }, (_, i) => {
  const ph = randomBetween(6.5, 8.5);
  const tds = randomBetween(100, 450);
  const temperature = randomBetween(16, 24);
  const turbidity = randomBetween(0.1, 4);
  const chlorine = randomBetween(0.3, 3.5);
  const qualityScore = randomBetween(75, 99);
  return {
    id: `WQ-${String(i + 1).padStart(4, '0')}`,
    timestamp: new Date(Date.now() - i * 86400000).toISOString(),
    ph,
    tds,
    temperature,
    turbidity,
    chlorine,
    qualityScore,
    status: qualityScore > 90 ? 'active' : qualityScore > 75 ? 'warning' : 'critical',
    location: pick(zones),
  };
});

export const mockAlerts: Alert[] = [
  { id: 'ALT-001', type: 'critical', title: 'Major Pipeline Leak Detected', message: 'Critical pressure drop in Sector 7 pipeline network.', severity: 'critical', timestamp: new Date(Date.now() - 300000).toISOString(), status: 'active', source: 'SNR-0012' },
  { id: 'ALT-002', type: 'pressure_drop', title: 'Pressure Drop Alert', message: 'Pressure below threshold in North Zone.', severity: 'high', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'active', source: 'SNR-0023' },
  { id: 'ALT-003', type: 'sensor_offline', title: 'Sensor Offline', message: 'Sensor SNR-0045 has been offline for 2 hours.', severity: 'medium', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'warning', source: 'SNR-0045' },
  { id: 'ALT-004', type: 'quality', title: 'Water Quality Alert', message: 'Chlorine levels below minimum in East Zone.', severity: 'high', timestamp: new Date(Date.now() - 86400000).toISOString(), status: 'active', source: 'SNR-0031' },
  { id: 'ALT-005', type: 'maintenance', title: 'Scheduled Maintenance', message: 'Pump station maintenance due tomorrow.', severity: 'low', timestamp: new Date(Date.now() - 172800000).toISOString(), status: 'pending', source: 'System' },
  { id: 'ALT-006', type: 'warning', title: 'Reservoir Level Low', message: 'Reservoir Beta at 35% capacity.', severity: 'medium', timestamp: new Date(Date.now() - 259200000).toISOString(), status: 'warning', source: 'RSV-002' },
  { id: 'ALT-007', type: 'critical', title: 'Emergency Valve Failure', message: 'Main distribution valve V-012 malfunction detected.', severity: 'critical', timestamp: new Date(Date.now() - 432000000).toISOString(), status: 'resolved', source: 'VLV-012' },
  { id: 'ALT-008', type: 'info', title: 'Daily Report Ready', message: 'Your daily water distribution report is available.', severity: 'low', timestamp: new Date(Date.now() - 604800000).toISOString(), status: 'resolved', source: 'System' },
];

export const mockAnalytics: AnalyticsDataPoint[] = Array.from({ length: 365 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (364 - i));
  const seasonal = Math.sin((i / 365) * Math.PI * 2) * 500;
  return {
    date: date.toISOString().split('T')[0],
    consumption: randomBetween(8000, 15000) + seasonal,
    pressure: randomBetween(3.0, 5.0),
    leaks: randomInt(0, 3),
    quality: randomBetween(85, 99),
    revenue: randomBetween(50000, 120000),
    waterSaved: randomBetween(500, 3000),
  };
});

export const mockMapMarkers: MapMarker[] = [
  ...mockReservoirs.map((r) => ({
    id: r.id,
    type: 'reservoir' as const,
    position: [r.location.lat, r.location.lng] as [number, number],
    label: r.name,
    data: { level: `${((r.currentLevel / r.capacity) * 100).toFixed(0)}%`, capacity: r.capacity },
  })),
  ...mockSensors.slice(0, 20).map((s) => ({
    id: s.id,
    type: 'sensor' as const,
    position: [s.location.lat, s.location.lng] as [number, number],
    label: s.name,
    data: {
      pressure: s.pressure.toFixed(2),
      flow: s.flow.toFixed(0),
      temperature: s.temperature.toFixed(1),
      battery: s.battery.toFixed(0),
      status: s.status,
      lastUpdated: s.lastUpdated,
    },
  })),
  ...mockLeaks.filter((l) => l.status !== 'resolved').slice(0, 8).map((l) => ({
    id: l.id,
    type: 'leak' as const,
    position: [l.location.lat, l.location.lng] as [number, number],
    label: `Leak ${l.id}`,
    data: { severity: l.severity, confidence: `${l.aiConfidence.toFixed(0)}%` },
  })),
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `TNK-${String(i + 1).padStart(3, '0')}`,
    type: 'tank' as const,
    position: [baseLat + randomBetween(-0.05, 0.05), baseLng + randomBetween(-0.05, 0.05)] as [number, number],
    label: `Water Tank ${i + 1}`,
    data: { capacity: randomInt(10000, 50000) },
  })),
  ...mockConsumers.slice(0, 15).map((c) => ({
    id: c.id,
    type: 'consumer' as const,
    position: [baseLat + randomBetween(-0.06, 0.06), baseLng + randomBetween(-0.06, 0.06)] as [number, number],
    label: c.name,
    data: { usage: c.usage.toFixed(0), zone: c.zone },
  })),
];

export const mockPipelines: Pipeline[] = Array.from({ length: 8 }, (_, i) => ({
  id: `PL-${String(i + 1).padStart(3, '0')}`,
  name: `Pipeline Network ${i + 1}`,
  status: pick(['active', 'warning', 'maintenance'] as Status[]),
  pressure: randomBetween(2.5, 5.5),
  flow: randomBetween(200, 1000),
  length: randomInt(500, 5000),
  valves: Array.from({ length: randomInt(2, 5) }, (_, vi) => ({
    id: `VLV-${i}${vi}`,
    name: `Valve ${i + 1}-${vi + 1}`,
    status: pick(['active', 'inactive', 'maintenance'] as Status[]),
    openPercent: randomInt(0, 100),
  })),
}));

export const mockPumps: Pump[] = Array.from({ length: 6 }, (_, i) => ({
  id: `PMP-${String(i + 1).padStart(3, '0')}`,
  name: `Pump Station ${i + 1}`,
  status: pick(['active', 'maintenance', 'offline'] as Status[]),
  flowRate: randomBetween(500, 2000),
  power: randomBetween(50, 200),
  efficiency: randomBetween(75, 98),
}));

export const mockMaintenanceTasks: MaintenanceTask[] = Array.from({ length: 15 }, (_, i) => ({
  id: `MNT-${String(i + 1).padStart(4, '0')}`,
  title: ['Pipeline Inspection', 'Sensor Calibration', 'Valve Replacement', 'Pump Repair', 'Leak Investigation'][i % 5],
  type: pick(['repair', 'inspection', 'calibration', 'replacement'] as const),
  assignedTo: ['John Smith', 'Sarah Chen', 'Mike Johnson', 'Lisa Park', 'David Kim'][i % 5],
  priority: pick(severities),
  status: pick(['active', 'pending', 'resolved', 'warning'] as Status[]),
  scheduledDate: new Date(Date.now() + randomInt(-7, 14) * 86400000).toISOString(),
  equipment: pick(['Pipeline PL-001', 'Sensor SNR-0012', 'Pump PMP-003', 'Valve VLV-005']),
}));

export const mockAIInsights: AIInsight[] = [
  { id: 'AI-001', type: 'leak', title: 'Leak Prediction', prediction: 'High probability of leak in Sector 4 within 48 hours', confidence: 87, recommendation: 'Deploy inspection team to Pipeline PL-004 junction points', impact: 'Potential loss: 2,500 L/day', timeframe: '48 hours' },
  { id: 'AI-002', type: 'demand', title: 'Demand Forecast', prediction: '15% increase in water demand expected this weekend', confidence: 92, recommendation: 'Increase reservoir output by 10% starting Friday', impact: 'Supply optimization', timeframe: '3 days' },
  { id: 'AI-003', type: 'maintenance', title: 'Maintenance Prediction', prediction: 'Pump PMP-003 requires service within 7 days', confidence: 78, recommendation: 'Schedule preventive maintenance before efficiency drops below 80%', impact: 'Avoid unplanned downtime', timeframe: '7 days' },
  { id: 'AI-004', type: 'failure', title: 'Failure Risk Assessment', prediction: 'Valve VLV-012 showing signs of degradation', confidence: 83, recommendation: 'Replace valve assembly and recalibrate pressure sensors', impact: 'Prevent cascade failure', timeframe: '14 days' },
  { id: 'AI-005', type: 'water_loss', title: 'Water Loss Forecast', prediction: 'Non-revenue water expected to increase by 8% next month', confidence: 71, recommendation: 'Accelerate leak detection in high-loss zones', impact: 'Revenue impact: $12,000/month', timeframe: '30 days' },
];

export const mockDashboardMetrics: DashboardMetric[] = [
  { id: 'supply', title: 'Current Water Supply', value: 847500, unit: 'L', change: 3.2, status: 'active', sparkline: generateSparkline(850000, 15000) },
  { id: 'pressure', title: 'Water Pressure', value: 4.2, unit: 'bar', change: -1.5, status: 'active', sparkline: generateSparkline(4.2, 0.5) },
  { id: 'reservoir', title: 'Reservoir Level', value: 72, unit: '%', change: 5.1, status: 'active', sparkline: generateSparkline(72, 8) },
  { id: 'sensors', title: 'Sensors Online', value: 47, unit: '/50', change: 0, status: 'warning', sparkline: generateSparkline(47, 2) },
  { id: 'leaks', title: 'Leaks Detected', value: 3, unit: 'active', change: -25, status: 'critical', sparkline: generateSparkline(3, 1) },
  { id: 'consumption', title: "Today's Consumption", value: 12450, unit: 'm³', change: 8.3, status: 'active', sparkline: generateSparkline(12000, 2000) },
  { id: 'quality', title: 'Water Quality', value: 94, unit: 'score', change: 1.2, status: 'active', sparkline: generateSparkline(94, 3) },
  { id: 'ai', title: 'AI Prediction Accuracy', value: 91, unit: '%', change: 2.4, status: 'active', sparkline: generateSparkline(91, 2) },
];

export const generatePressureData = (hours = 24) =>
  Array.from({ length: hours }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    pressure: randomBetween(3.0, 5.5),
    threshold: 3.5,
  }));

export const generateFlowData = (hours = 24) =>
  Array.from({ length: hours }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    flow: randomBetween(200, 900),
    predicted: randomBetween(250, 850),
  }));

export const generateReservoirHistory = (days = 30) =>
  Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return {
      date: date.toISOString().split('T')[0],
      level: randomBetween(40, 95),
      capacity: 100,
      inflow: randomBetween(1000, 5000),
      outflow: randomBetween(800, 4500),
    };
  });

export const generateMonthlyConsumption = () =>
  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => ({
    month,
    consumption: randomBetween(250000, 450000),
    forecast: randomBetween(260000, 460000),
  }));

export const generateZoneDistribution = () =>
  zones.map((zone) => ({
    name: zone,
    value: randomBetween(15000, 45000),
  }));

export const generateHeatmapData = () =>
  Array.from({ length: 7 }, (_, day) =>
    Array.from({ length: 24 }, (_, hour) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day],
      hour,
      value: randomBetween(100, 900),
    }))
  ).flat();
