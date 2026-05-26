import type { ScheduleFrequency } from '@/types/config';

export function toCronExpression(frequency: ScheduleFrequency, hour: number): string {
  const h = Math.min(23, Math.max(0, Math.floor(hour)));
  switch (frequency) {
    case 'daily':
      return `0 ${h} * * *`;
    case 'weekly':
      return `0 ${h} * * 0`;
    case 'monthly':
      return `0 ${h} 1 * *`;
  }
}
