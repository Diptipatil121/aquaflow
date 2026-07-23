import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, MoreHorizontal } from 'lucide-react';
import { consumerService } from '@/services/consumerService';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Search } from '@/components/ui/Search';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Loader';
import { useDebounce } from '@/hooks';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { formatNumber } from '@/utils';
import type { Consumer } from '@/types';

export default function ConsumersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useQuery({
    queryKey: ['consumers', page, debouncedSearch, statusFilter, zoneFilter],
    queryFn: () => consumerService.getAll(page, DEFAULT_PAGE_SIZE, debouncedSearch, statusFilter, zoneFilter),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Consumer Management</h1>
        <p className="text-sm text-slate-500">Manage consumers, billing, and leak reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Consumers ({data?.total ?? 0})</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Search value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search consumers..." className="w-full sm:w-64" />
            <Select
              options={[
                { value: '', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'warning', label: 'Warning' },
              ]}
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full sm:w-40"
            />
            <Select
              options={[
                { value: '', label: 'All Zones' },
                { value: 'North Zone', label: 'North' },
                { value: 'South Zone', label: 'South' },
                { value: 'East Zone', label: 'East' },
                { value: 'West Zone', label: 'West' },
                { value: 'Central Zone', label: 'Central' },
              ]}
              value={zoneFilter}
              onChange={(e) => { setZoneFilter(e.target.value); setPage(1); }}
              className="w-full sm:w-40"
            />
          </div>
        </CardHeader>

        {isLoading ? <PageLoader /> : (
          <>
            <Table<Consumer>
              data={data?.data ?? []}
              columns={[
                { key: 'id', label: 'Consumer ID', sortable: true },
                { key: 'name', label: 'Name', sortable: true },
                { key: 'address', label: 'Address', className: 'max-w-[200px] truncate' },
                { key: 'usage', label: 'Usage', render: (c) => `${formatNumber(c.usage)} L`, sortable: true },
                { key: 'billingStatus', label: 'Billing', render: (c) => <StatusBadge status={c.billingStatus} /> },
                { key: 'leakReports', label: 'Leak Reports' },
                { key: 'status', label: 'Status', render: (c) => <StatusBadge status={c.status} /> },
                {
                  key: 'actions', label: 'Actions',
                  render: () => (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" aria-label="View"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" aria-label="More"><MoreHorizontal className="h-4 w-4" /></Button>
                    </div>
                  ),
                },
              ]}
            />
            {data && data.totalPages > 1 && (
              <div className="mt-4">
                <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
