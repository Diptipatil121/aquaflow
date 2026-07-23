import { delay } from '@/utils';
import {
  mockSensors,
  mockLeaks,
  mockDashboardMetrics,
  mockMapMarkers,
  generatePressureData,
  generateFlowData,
} from '@/api/mockData';
import type { DashboardMetric, LeakEvent, MapMarker, PaginatedResponse, Sensor } from '@/types';

export const sensorService = {
  async getAll(): Promise<Sensor[]> {
    await delay(600);
    return mockSensors;
  },

  async getById(id: string): Promise<Sensor | undefined> {
    await delay(300);
    return mockSensors.find((s) => s.id === id);
  },

  async getOnlineCount(): Promise<number> {
    await delay(200);
    return mockSensors.filter((s) => s.status !== 'offline').length;
  },
};

export const leakService = {
  async getAll(): Promise<LeakEvent[]> {
    await delay(600);
    return mockLeaks;
  },

  async getActive(): Promise<LeakEvent[]> {
    await delay(400);
    return mockLeaks.filter((l) => l.status !== 'resolved');
  },

  async getPressureData() {
    await delay(400);
    return generatePressureData();
  },

  async getFlowData() {
    await delay(400);
    return generateFlowData();
  },

  async emergencyShutdown(): Promise<{ success: boolean; message: string }> {
    await delay(1500);
    return { success: true, message: 'Emergency shutdown initiated. All valves closed.' };
  },
};

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetric[]> {
    await delay(500);
    return mockDashboardMetrics;
  },

  async getMapMarkers(): Promise<MapMarker[]> {
    await delay(400);
    return mockMapMarkers;
  },
};

export const getPaginated = <T>(
  items: T[],
  page: number,
  pageSize: number
): PaginatedResponse<T> => {
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  return {
    data,
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
  };
};
