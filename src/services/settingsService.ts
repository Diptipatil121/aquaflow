import { delay } from '@/utils';
import {
  mockReservoirs,
  mockPipelines,
  mockPumps,
  mockMaintenanceTasks,
  mockAlerts,
  mockAIInsights,
  generateReservoirHistory,
} from '@/api/mockData';
import type { NotificationSettings } from '@/types';

export const distributionService = {
  async getPipelines() {
    await delay(500);
    return mockPipelines;
  },

  async getPumps() {
    await delay(400);
    return mockPumps;
  },
};

export const reservoirService = {
  async getAll() {
    await delay(500);
    return mockReservoirs;
  },

  async getHistory() {
    await delay(400);
    return generateReservoirHistory();
  },
};

export const maintenanceService = {
  async getTasks() {
    await delay(500);
    return mockMaintenanceTasks;
  },
};

export const alertService = {
  async getAll() {
    await delay(400);
    return mockAlerts;
  },

  async resolve(id: string) {
    await delay(500);
    return { success: true, id };
  },

  async assign(id: string, assignee: string) {
    await delay(500);
    return { success: true, id, assignee };
  },

  async delete(id: string) {
    await delay(400);
    return { success: true, id };
  },
};

export const aiService = {
  async getInsights() {
    await delay(600);
    return mockAIInsights;
  },
};

const defaultSettings: NotificationSettings = {
  email: true,
  push: true,
  sms: false,
  criticalAlerts: true,
  maintenanceReminders: true,
  dailyReports: false,
};

export const settingsService = {
  async getNotifications(): Promise<NotificationSettings> {
    await delay(300);
    return defaultSettings;
  },

  async updateNotifications(settings: NotificationSettings) {
    await delay(500);
    return settings;
  },

  async getThresholds() {
    await delay(300);
    return {
      pressureMin: 2.5,
      pressureMax: 6.0,
      flowMin: 100,
      flowMax: 1000,
      qualityMin: 80,
      batteryMin: 20,
    };
  },

  async updateThresholds(thresholds: Record<string, number>) {
    await delay(500);
    return thresholds;
  },
};
