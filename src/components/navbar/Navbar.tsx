import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Menu, Search as SearchIcon, Bell, Sun, Moon, LogOut, User, Settings, ChevronDown,
} from 'lucide-react';
import { cn } from '@/utils';
import { useAuth, useTheme, useNotifications } from '@/context';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown } from '@/components/ui/Tooltip';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';

interface NavbarProps {
  onMenuClick: () => void;
  breadcrumbs: { label: string; href?: string }[];
}

export function Navbar({ onMenuClick, breadcrumbs }: NavbarProps) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200/50 bg-white/80 px-4 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/80 lg:px-6"
    >
      <button
        onClick={onMenuClick}
        className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Breadcrumb items={breadcrumbs} className="hidden sm:flex" />

      <div className="ml-auto flex items-center gap-2">
        <div className={cn('relative transition-all', searchOpen ? 'w-64' : 'w-10')}>
          {searchOpen ? (
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => !searchQuery && setSearchOpen(false)}
              placeholder="Search..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800"
              aria-label="Search"
            />
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Open search"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
          )}
          {searchOpen && (
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          )}
        </div>

        <button
          onClick={toggleTheme}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button
          onClick={() => setNotificationsOpen(true)}
          className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <NotificationPanel isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />

        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Avatar name={user?.name ?? 'User'} size="sm" />
              <span className="hidden text-sm font-medium md:block">{user?.name}</span>
              <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
            </button>
          }
          items={[
            { label: 'Profile', onClick: () => navigate('/settings'), icon: <User className="h-4 w-4" /> },
            { label: 'Settings', onClick: () => navigate('/settings'), icon: <Settings className="h-4 w-4" /> },
            { label: 'Logout', onClick: logout, icon: <LogOut className="h-4 w-4" />, danger: true },
          ]}
        />
      </div>
    </motion.header>
  );
}
