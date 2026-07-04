import cron from 'node-cron';
import { monitorService } from '../services/monitorService.js';

export const startMonitorJob = () => {
  cron.schedule('* * * * *', async () => {
    console.log('Starting monitor job...');
    await monitorService();
  });
};