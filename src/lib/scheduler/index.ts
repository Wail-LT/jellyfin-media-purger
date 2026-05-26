import cron, { type ScheduledTask } from 'node-cron';
import { getSettings } from '@/lib/db/settings';
import { appendLog } from '@/lib/db/logs';
import { toCronExpression } from './cronExpression';
import { runScheduledCleanup } from '@/lib/services/runScheduledCleanup';

type SchedulerState = {
  task: ScheduledTask | null;
  isRunning: boolean;
};

const globalForScheduler = global as unknown as { schedulerState: SchedulerState | undefined };

function getState(): SchedulerState {
  if (!globalForScheduler.schedulerState) {
    globalForScheduler.schedulerState = { task: null, isRunning: false };
  }
  return globalForScheduler.schedulerState;
}

function stopTask(): void {
  const { task } = getState();
  if (task) {
    task.stop();
    getState().task = null;
  }
}

async function executeJob(): Promise<void> {
  const state = getState();
  if (state.isRunning) {
    appendLog('warning', 'Scheduled cleanup skipped: previous run still in progress.');
    return;
  }

  state.isRunning = true;
  try {
    await runScheduledCleanup();
  } finally {
    state.isRunning = false;
  }
}

export function refreshScheduler(): void {
  stopTask();

  const config = getSettings();
  if (!config.schedule_enabled) {
    return;
  }

  const expression = toCronExpression(config.schedule_frequency, config.schedule_hour);
  if (!cron.validate(expression)) {
    appendLog('error', `Invalid cron expression for scheduler: ${expression}`);
    return;
  }

  const task = cron.schedule(expression, () => {
    void executeJob();
  });

  getState().task = task;
  appendLog(
    'info',
    `Scheduler active: ${config.schedule_frequency} at ${config.schedule_hour}:00 (server local time).`,
  );
}

export function initScheduler(): void {
  refreshScheduler();
}
