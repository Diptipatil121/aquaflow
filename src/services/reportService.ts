import { delay, downloadBlob } from '@/utils';

const reportTypes = [
  { id: 'daily', name: 'Daily Report', type: 'daily' as const, description: 'Comprehensive daily water distribution summary' },
  { id: 'monthly', name: 'Monthly Report', type: 'monthly' as const, description: 'Monthly consumption and performance analytics' },
  { id: 'leak', name: 'Leak Report', type: 'leak' as const, description: 'Detailed leak detection and resolution report' },
  { id: 'quality', name: 'Water Quality Report', type: 'quality' as const, description: 'Water quality metrics and compliance status' },
  { id: 'sensor', name: 'Sensor Report', type: 'sensor' as const, description: 'Sensor health and performance report' },
];

export const reportService = {
  async getAvailable() {
    await delay(400);
    return reportTypes;
  },

  async generate(type: string) {
    await delay(1200);
    return { id: `RPT-${Date.now()}`, type, generatedAt: new Date().toISOString() };
  },

  async downloadPDF(type: string) {
    await delay(800);
    const content = `AquaFlow Report - ${type}\nGenerated: ${new Date().toISOString()}`;
    downloadBlob(new Blob([content], { type: 'application/pdf' }), `${type}-report.pdf`);
  },

  async downloadExcel(type: string) {
    await delay(800);
    const content = `Report Type,Generated At\n${type},${new Date().toISOString()}`;
    downloadBlob(new Blob([content], { type: 'text/csv' }), `${type}-report.csv`);
  },
};
