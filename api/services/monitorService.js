import axios from 'axios';
import Monitor from '../models/monitor.js';
import MonitorLog from '../models/MonitorLog.js';
import { sendStatusEmail } from './notification.js';

const normalizeUrl = (value) => {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

export const getMonitorTargetUrl = (project) => {
  if (!project) return null;
  const candidates = [project.websiteUrl, project.apiBaseUrl];
  for (const candidate of candidates) {
    const normalized = normalizeUrl(candidate);
    if (normalized) return normalized;
  }
  return null;
};

export const monitorService = async () => {
  try {
    const monitors = await Monitor.find({ enabled: true })
    .populate('project')
    .populate('createdBy', 'email');

    for (const monitor of monitors) {
      const project = monitor.project;
      const user = monitor.createdBy;
      const targetUrl = getMonitorTargetUrl(project);
      if (!targetUrl) continue;

      const reqStart = Date.now();
      const previousStatus = monitor.lastStatus || 'UNKNOWN';
      try {
        const response = await axios.get(targetUrl, {
          timeout: monitor.timeout || 10000,
        });

        const responseTime = Date.now() - reqStart;
        const isUp = response.status === monitor.expectedStatus;
        const nextStatus = isUp ? 'UP' : 'DOWN';

        const newTotalChecks = monitor.totalChecks + 1;
        const newSuccessfulChecks = isUp
          ? monitor.successfulChecks + 1
          : monitor.successfulChecks;
        const newFailedChecks = isUp
          ? monitor.failedChecks
          : monitor.failedChecks + 1;

        await MonitorLog.create({
          monitor: monitor._id,
          project: monitor.project._id,
          status: nextStatus,
          statusCode: response.status,
          responseTime,
        });

        await Monitor.findByIdAndUpdate(monitor._id, {
          lastChecked: new Date(),
          lastStatus: nextStatus,
          lastResponseTime: responseTime,
          errorMessage: '',
          totalChecks: newTotalChecks,
          successfulChecks: newSuccessfulChecks,
          failedChecks: newFailedChecks,
          consecutiveFailures: isUp ? 0 : monitor.consecutiveFailures + 1,
          uptimePercentage: (newSuccessfulChecks / newTotalChecks) * 100,
        });
        
        // Send notification on status change
        if (user?.email) {
          if (previousStatus !== 'UP' && nextStatus === 'UP') {
            await sendStatusEmail({
              to: user.email,
              monitor: monitor._id,
              project: project.name,
              status: 'UP'
            });
          }
          if (previousStatus !== 'DOWN' && nextStatus === 'DOWN') {
            await sendStatusEmail({
              to: user.email,
              monitor: monitor._id,
              project: project.name,
              status: 'DOWN'
            });
          }
        }

      } catch (error) {
        const responseTime = Date.now() - reqStart;
        const newTotalChecks = monitor.totalChecks + 1;
        const newFailedChecks = monitor.failedChecks + 1;

        await Monitor.findByIdAndUpdate(monitor._id, {
          lastChecked: new Date(),
          lastStatus: 'DOWN',
          lastResponseTime: responseTime,
          errorMessage: error.message,
          totalChecks: newTotalChecks,
          failedChecks: newFailedChecks,
          consecutiveFailures: monitor.consecutiveFailures + 1,
          uptimePercentage: (monitor.successfulChecks / newTotalChecks) * 100,
        });

        await MonitorLog.create({
          monitor: monitor._id,
          project: monitor.project._id,
          status: 'DOWN',
          responseTime,
          errorMessage: error.message,
        });
        
        // Send notification on error if was UP
        if (user?.email && previousStatus !== 'DOWN') {
          await sendStatusEmail({
            to: user.email,
            monitor: monitor._id,
            project: project.name,
            status: 'DOWN'
          });
        }
      }
    } 

    return monitors;
  } catch (error) {
    console.error('Error fetching monitors:', error);
    return [];
  }
};