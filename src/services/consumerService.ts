import { delay } from '@/utils';
import { mockConsumers } from '@/api/mockData';
import { getPaginated } from '@/services/sensorService';
import type { Consumer } from '@/types';

export const consumerService = {
  async getAll(page = 1, pageSize = 10, search = '', status = '', zone = '') {
    await delay(500);
    let filtered = [...mockConsumers];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q)
      );
    }
    if (status) filtered = filtered.filter((c) => c.status === status);
    if (zone) filtered = filtered.filter((c) => c.zone === zone);

    return getPaginated(filtered, page, pageSize);
  },

  async getById(id: string): Promise<Consumer | undefined> {
    await delay(300);
    return mockConsumers.find((c) => c.id === id);
  },
};
