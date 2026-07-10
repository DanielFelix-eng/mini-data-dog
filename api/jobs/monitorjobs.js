import cron from 'node-cron';
import { monitorService } from '../services/monitorService.js';

export const startMonitorJob = () => {
  cron.schedule('* * * * *', async () => {
    await monitorService();
  });
};