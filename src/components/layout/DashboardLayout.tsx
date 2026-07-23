import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { Navbar } from '@/components/navbar/Navbar';
import { NAV_ITEMS } from '@/utils/constants';

const pageTitles: Record<string, string> = Object.fromEntries(
  NAV_ITEMS.map((item) => [item.path, item.label])
);

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const collapsed = false;
  const location = useLocation();

  const currentPage = pageTitles[location.pathname] ?? 'Dashboard';
  const breadcrumbs = [{ label: currentPage }];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} collapsed={collapsed} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          breadcrumbs={breadcrumbs}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
