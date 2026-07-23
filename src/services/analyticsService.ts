import { delay } from '@/utils';
import {
  mockAnalytics,
  mockQualityReadings,
  generateMonthlyConsumption,
  generateZoneDistribution,
  generateHeatmapData,
} from '@/api/mockData';

export const analyticsService = {
  async getDaily(days = 30) {
    await delay(600);
    return mockAnalytics.slice(-days);
  },

  async getMonthly() {
    await delay(500);
    return generateMonthlyConsumption();
  },

  async getZoneDistribution() {
    await delay(400);
    return generateZoneDistribution();
  },

  async getHeatmap() {
    await delay(500);
    return generateHeatmapData();
  },

  async getSummary() {
    await delay(400);
    const recent = mockAnalytics.slice(-30);
    return {
      totalConsumption: recent.reduce((s, d) => s + d.consumption, 0),
      avgPressure: recent.reduce((s, d) => s + d.pressure, 0) / recent.length,
      totalLeaks: recent.reduce((s, d) => s + d.leaks, 0),
      waterSaved: recent.reduce((s, d) => s + d.waterSaved, 0),
      revenueSaved: recent.reduce((s, d) => s + d.revenue, 0),
    };
  },
};

export const qualityService = {
  async getReadings() {
    await delay(500);
    return mockQualityReadings;
  },

  async getLatest() {
    await delay(300);
    return mockQualityReadings[0];
  },
};
