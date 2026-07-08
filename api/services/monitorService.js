import axios from 'axios';
import Monitor from '../models/monitor.js';
import MonitorLog from '../models/MonitorLog.js'

const normalizeUrl = (value) => {
  if (!value) return null;

  const trimmed = String(value).trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

export const getMonitorTargetUrl = (project) => {
  if (!project) return null;

  const candidates = [project.websiteUrl, project.apiBaseUrl];

  for (const candidate of candidates) {
    const normalized = normalizeUrl(candidate);
    if (normalized) {
      return normalized;
    }
  }

  return null;
};

export const monitorService = async () => {
  const start = Date.now()

  try {
    const monitors = await Monitor.find({ enabled: true }).populate('project');

    console.log('Found monitors , monitors.length:', monitors.length);

    for (const monitor of monitors) {
      const project = monitor.project;
      const targetUrl = getMonitorTargetUrl(project);

      if (!targetUrl) {
        console.warn(`Monitor ${monitor._id} skipped because project ${project?.name || 'unknown'} has no valid URL`);
        continue;
      }
      const responseTime = Date.now() - start;

      try {
        const response = await axios.get(targetUrl, {
          timeout: monitor.timeout || 10000,
        });

        const nextStatus = response.status === monitor.expectedStatus ? 'UP' : 'DOWN';

        await MonitorLog.create({
          monitor: monitor._id,
          project: monitor.project._id,
          status: nextStatus ? 'UP' : 'DOWN',
          statusCode: response.status,
          responseTime,
        })
        await Monitor.findByIdAndUpdate(monitor._id, {
          lastChecked: new Date(),
          lastStatus: nextStatus,
          lastStatus: 'UP',
          lastResponseTime: responseTime,
          totalChecks: monitor.totalChecks + 1,
          successfullChecks: nextStatus ? monitor.successfullChecks + 1 :
            monitor.successfullChecks,
          failedChecks: nextStatus ? monitor.failedChecks : monitor.failedChecks + 1,
          consecutiveFailures: nextStatus ? 0 : monitor.consecutiveFailures + 1,
        });

        console.log(`Monitor ${monitor._id} for project ${project?.name || 'unknown'} responded with status: ${response.status}`);
      } catch (error) {
        await Monitor.findByIdAndUpdate(monitor._id, {

          lastChecked: new Date(),
          lastStatus: 'DOWN',
          lastResponseTime: responseTime,
          errorMessage: error.message,
          totalChecks: monitor.totalChecks + 1,


          failedChecks: monitor.failedChecks + 1,


        });
        await MonitorLog.create({
          monitor: monitor._id,
          project: monitor.project._id,
          status: 'DOWN',
          responseTime,
        })

        console.error(`Monitor ${monitor._id} for project ${project?.name || 'unknown'} failed: ${error.message}`);
      }
    }

    return monitors;
  } catch (error) {
    console.error('Error fetching monitors:', error);
    return [];
  }
};
