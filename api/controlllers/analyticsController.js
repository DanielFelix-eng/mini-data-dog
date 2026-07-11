import Monitor from '../models/monitor.js';
import MonitorLog from '../models/MonitorLog.js';
import mongoose from 'mongoose';

const TIME_RANGES = {
  '1h': 60 * 60 * 1000,
  '6h': 6 * 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
};

const getTimeRangeMs = (range) => TIME_RANGES[range] || TIME_RANGES['24h'];

const getBucketSize = (range) => {
  if (range === '1h') return 60 * 1000;
  if (range === '6h') return 5 * 60 * 1000;
  if (range === '24h') return 60 * 60 * 1000;
  if (range === '7d') return 6 * 60 * 60 * 1000;
  return 24 * 60 * 60 * 1000;
};

export const getAnalyticsSummary = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const range = req.query.range || '24h';
    const monitorId = req.query.monitorId;

    const since = new Date(Date.now() - getTimeRangeMs(range));

    const monitorFilter = { createdBy: userId, enabled: true };
    if (monitorId && mongoose.Types.ObjectId.isValid(monitorId)) {
      monitorFilter._id = monitorId;
    }

    const monitors = await Monitor.find(monitorFilter).select('_id name project').lean();
    const monitorIds = monitors.map(m => m._id);

    if (!monitorIds.length) {
      return res.json({
        totalMonitors: 0,
        avgUptime: 0,
        avgResponseTime: 0,
        totalChecks: 0,
        totalErrors: 0,
        errorRate: 0,
      });
    }

    const logFilter = {
      monitor: { $in: monitorIds },
      checkedAt: { $gte: since },
    };

    const logs = await MonitorLog.find(logFilter)
      .select('monitor status responseTime statusCode checkedAt')
      .lean();

    const totalChecks = logs.length;
    const successfulChecks = logs.filter(l => l.status === 'UP').length;
    const totalErrors = totalChecks - successfulChecks;
    const errorRate = totalChecks > 0 ? (totalErrors / totalChecks) * 100 : 0;

    // Calculate total incidents (downtime periods)
    let totalIncidents = 0;
    const logsByMonitor = {};
    logs.forEach(log => {
      if (!logsByMonitor[log.monitor]) logsByMonitor[log.monitor] = [];
      logsByMonitor[log.monitor].push(log);
    });
    Object.values(logsByMonitor).forEach(monitorLogs => {
      monitorLogs.sort((a, b) => a.checkedAt - b.checkedAt);
      let inIncident = false;
      monitorLogs.forEach(log => {
        if (log.status === 'DOWN' && !inIncident) {
          inIncident = true;
          totalIncidents++;
        } else if (log.status === 'UP' && inIncident) {
          inIncident = false;
        }
      });
    });

    const responseTimes = logs.map(l => l.responseTime).filter(t => t > 0);
    const avgResponseTime = responseTimes.length > 0
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0;

    const uptimeByMonitor = {};
    monitorIds.forEach(id => { uptimeByMonitor[id] = { up: 0, total: 0 }; });
    logs.forEach(l => {
      if (uptimeByMonitor[l.monitor]) {
        uptimeByMonitor[l.monitor].total++;
        if (l.status === 'UP') uptimeByMonitor[l.monitor].up++;
      }
    });

    const uptimes = Object.values(uptimeByMonitor)
      .filter(u => u.total > 0)
      .map(u => (u.up / u.total) * 100);
    const avgUptime = uptimes.length > 0
      ? Math.round((uptimes.reduce((a, b) => a + b, 0) / uptimes.length) * 100) / 100
      : 0;

    res.json({
      totalMonitors: monitors.length,
      avgUptime,
      avgResponseTime,
      totalChecks,
      totalErrors,
      totalIncidents,
      errorRate: Math.round(errorRate * 100) / 100,
      monitors: monitors.map(m => ({
        id: m._id,
        name: m.name,
        project: m.project,
      })),
    });
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getUptimeOverTime = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const range = req.query.range || '24h';
    const monitorId = req.query.monitorId;

    const since = new Date(Date.now() - getTimeRangeMs(range));
    const bucketSize = getBucketSize(range);

    const monitorFilter = { createdBy: userId, enabled: true };
    if (monitorId && mongoose.Types.ObjectId.isValid(monitorId)) {
      monitorFilter._id = monitorId;
    }

    const monitors = await Monitor.find(monitorFilter).select('_id name').lean();
    const monitorIds = monitors.map(m => m._id);

    if (!monitorIds.length) {
      return res.json({ data: [], range, bucketSize });
    }

    const logFilter = {
      monitor: { $in: monitorIds },
      checkedAt: { $gte: since },
    };

    const logs = await MonitorLog.find(logFilter)
      .select('monitor status checkedAt')
      .sort({ checkedAt: 1 })
      .lean();

    const buckets = new Map();
    const bucketStart = Math.floor(since.getTime() / bucketSize) * bucketSize;
    const bucketEnd = Date.now();
    const numBuckets = Math.ceil((bucketEnd - bucketStart) / bucketSize);

    for (let i = 0; i < numBuckets; i++) {
      const bucketTime = bucketStart + i * bucketSize;
      monitorIds.forEach(id => {
        const key = `${id}-${bucketTime}`;
        buckets.set(key, { monitor: id, bucket: bucketTime, up: 0, total: 0 });
      });
    }

    logs.forEach(log => {
      const bucketTime = Math.floor(log.checkedAt.getTime() / bucketSize) * bucketSize;
      const key = `${log.monitor}-${bucketTime}`;
      const bucket = buckets.get(key);
      if (bucket) {
        bucket.total++;
        if (log.status === 'UP') bucket.up++;
      }
    });

    const data = Array.from(buckets.values())
      .filter(b => b.total > 0)
      .map(b => ({
        timestamp: b.bucket,
        monitor: b.monitor,
        uptime: Math.round((b.up / b.total) * 10000) / 100,
        up: b.up,
        total: b.total,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);

    res.json({ data, range, bucketSize });
  } catch (error) {
    console.error('Error fetching uptime over time:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getErrorRateAndStatusCodes = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const range = req.query.range || '24h';
    const monitorId = req.query.monitorId;

    const since = new Date(Date.now() - getTimeRangeMs(range));

    const monitorFilter = { createdBy: userId, enabled: true };
    if (monitorId && mongoose.Types.ObjectId.isValid(monitorId)) {
      monitorFilter._id = monitorId;
    }

    const monitors = await Monitor.find(monitorFilter).select('_id').lean();
    const monitorIds = monitors.map(m => m._id);

    if (!monitorIds.length) {
      return res.json({ statusCodes: [], errorRate: 0, totalChecks: 0, totalErrors: 0 });
    }

    const logFilter = {
      monitor: { $in: monitorIds },
      checkedAt: { $gte: since },
    };

    const logs = await MonitorLog.find(logFilter)
      .select('monitor status statusCode checkedAt')
      .lean();

    const totalChecks = logs.length;
    const errorLogs = logs.filter(l => l.status === 'DOWN');
    const totalErrors = errorLogs.length;
    const errorRate = totalChecks > 0 ? (totalErrors / totalChecks) * 100 : 0;

    const statusCodeCounts = {};
    errorLogs.forEach(log => {
      const code = log.statusCode || 0;
      statusCodeCounts[code] = (statusCodeCounts[code] || 0) + 1;
    });

    const statusCodes = Object.entries(statusCodeCounts)
      .map(([code, count]) => ({ statusCode: parseInt(code), count, percentage: Math.round((count / totalErrors) * 10000) / 100 }))
      .sort((a, b) => b.count - a.count);

    res.json({
      statusCodes,
      errorRate: Math.round(errorRate * 100) / 100,
      totalChecks,
      totalErrors,
      range,
    });
  } catch (error) {
    console.error('Error fetching error rate:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getIncidentTimeline = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const range = req.query.range || '24h';
    const monitorId = req.query.monitorId;
    const limit = parseInt(req.query.limit) || 50;

    const since = new Date(Date.now() - getTimeRangeMs(range));

    const monitorFilter = { createdBy: userId, enabled: true };
    if (monitorId && mongoose.Types.ObjectId.isValid(monitorId)) {
      monitorFilter._id = monitorId;
    }

    const monitors = await Monitor.find(monitorFilter).select('_id name project').lean();
    const monitorIds = monitors.map(m => m._id);
    const monitorMap = Object.fromEntries(monitors.map(m => [m._id.toString(), m]));

    if (!monitorIds.length) {
      return res.json({ incidents: [], range });
    }

    const logFilter = {
      monitor: { $in: monitorIds },
      checkedAt: { $gte: since },
    };

    const logs = await MonitorLog.find(logFilter)
      .select('monitor status statusCode responseTime checkedAt error')
      .sort({ checkedAt: 1 })
      .lean();

    const incidents = [];
    let currentIncident = null;

    logs.forEach(log => {
      const isDown = log.status === 'DOWN';

      if (isDown && !currentIncident) {
        currentIncident = {
          monitor: log.monitor,
          monitorName: monitorMap[log.monitor]?.name || 'Unknown',
          project: monitorMap[log.monitor]?.project,
          startTime: log.checkedAt,
          endTime: null,
          duration: null,
          error: log.error,
          statusCode: log.statusCode,
          responseTime: log.responseTime,
        };
      } else if (!isDown && currentIncident && currentIncident.monitor.equals(log.monitor)) {
        currentIncident.endTime = log.checkedAt;
        currentIncident.duration = currentIncident.endTime.getTime() - currentIncident.startTime.getTime();
        incidents.push(currentIncident);
        currentIncident = null;
      }
    });

    if (currentIncident) {
      currentIncident.endTime = new Date();
      currentIncident.duration = currentIncident.endTime.getTime() - currentIncident.startTime.getTime();
      incidents.push(currentIncident);
    }

    const sortedIncidents = incidents
      .sort((a, b) => b.startTime - a.startTime)
      .slice(0, limit)
      .map(i => ({
        ...i,
        durationMs: i.duration,
        durationHuman: formatDuration(i.duration),
      }));

    res.json({ incidents: sortedIncidents, range });
  } catch (error) {
    console.error('Error fetching incident timeline:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getMonitorComparison = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const range = req.query.range || '24h';

    const since = new Date(Date.now() - getTimeRangeMs(range));

    const monitors = await Monitor.find({ createdBy: userId, enabled: true })
      .select('_id name project')
      .lean();

    if (!monitors.length) {
      return res.json({ comparison: [], range });
    }

    const monitorIds = monitors.map(m => m._id);

    const logs = await MonitorLog.find({
      monitor: { $in: monitorIds },
      checkedAt: { $gte: since },
    })
      .select('monitor status responseTime checkedAt')
      .lean();

    const statsByMonitor = {};
    monitorIds.forEach(id => {
      statsByMonitor[id] = {
        monitor: id,
        name: monitors.find(m => m._id.equals(id))?.name || 'Unknown',
        project: monitors.find(m => m._id.equals(id))?.project,
        totalChecks: 0,
        upChecks: 0,
        downChecks: 0,
        responseTimes: [],
      };
    });

    logs.forEach(log => {
      const stat = statsByMonitor[log.monitor];
      if (stat) {
        stat.totalChecks++;
        if (log.status === 'UP') {
          stat.upChecks++;
          if (log.responseTime > 0) stat.responseTimes.push(log.responseTime);
        } else {
          stat.downChecks++;
        }
      }
    });

    const comparison = Object.values(statsByMonitor)
      .filter(s => s.totalChecks > 0)
      .map(s => {
        const uptime = (s.upChecks / s.totalChecks) * 100;
        const responseTimes = s.responseTimes.sort((a, b) => a - b);
        const p50 = responseTimes[Math.floor(responseTimes.length * 0.5)] || 0;
        const p95 = responseTimes[Math.floor(responseTimes.length * 0.95)] || 0;
        const p99 = responseTimes[Math.floor(responseTimes.length * 0.99)] || 0;
        const avg = responseTimes.length > 0
          ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
          : 0;

        return {
          monitor: s.monitor,
          name: s.name,
          project: s.project,
          totalChecks: s.totalChecks,
          uptime: Math.round(uptime * 100) / 100,
          avgResponseTime: avg,
          p50ResponseTime: p50,
          p95ResponseTime: p95,
          p99ResponseTime: p99,
        };
      })
      .sort((a, b) => b.uptime - a.uptime);

    res.json({ comparison, range });
  } catch (error) {
    console.error('Error fetching monitor comparison:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

function formatDuration(ms) {
  if (!ms) return '0s';
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  if (ms < 3600000) return `${Math.round(ms / 60000)}m`;
  if (ms < 86400000) return `${Math.round(ms / 3600000)}h`;
  return `${Math.round(ms / 86400000)}d`;
}