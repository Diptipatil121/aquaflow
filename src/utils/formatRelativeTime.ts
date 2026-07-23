import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/utils';

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}
