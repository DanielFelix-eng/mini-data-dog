import Monitor from '../models/monitor.js';
import MonitorLog from '../models/MonitorLog.js';
import mongoose from 'mongoose';

export const getDashBoardStats = async (req, res) => {
  try {
    const monitors = await Monitor.find({ enabled: true });
    const total = monitors.length;

    const online = monitors.filter((m) => m.lastStatus === 'UP').length;
    const offline = monitors.filter((m) => m.lastStatus === 'DOWN').length;

    const averageResponseTime = total > 0
      ? Math.round(
          monitors.reduce((sum, m) => sum + (m.lastResponseTime || 0), 0) / total
        )
      : 0;

    res.json({
      total,
      online,
      offline,
      averageResponseTime,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getResponseTime = async (req, res) => {
  try {
    const { monitorId } = req.query;

    const filter = {};
    if (monitorId) {
      if (!mongoose.Types.ObjectId.isValid(monitorId)) {
        return res.status(400).json({ message: 'Invalid monitor id' });
      }
      filter.monitor = monitorId;
    }

    // Pull from MonitorLog so this is an actual time series of checks,
    // not just the latest snapshot of up to 20 different monitors.
    const logs = await MonitorLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(20)
      .select('createdAt responseTime status monitor')
      .lean();

    res.status(200).json(logs.reverse());
  } catch (error) {
    console.error('Error fetching response times:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const uptimePercentage = async (req, res) => {
  try {
    const id = req.params?.id || req.query?.id;

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid monitor id' });
      }

      const monitor = await Monitor.findById(id);
      if (!monitor) {
        return res.status(404).json({ message: 'Monitor not found' });
      }
      return res.json({ uptime: monitor.uptimePercentage ?? 0 });
    }

    const monitors = await Monitor.find({ enabled: true });
    if (!monitors.length) return res.json({ uptime: 0 });

    // Weighted by total checks, so a monitor with 5 checks doesn't
    // count the same as one with 50,000.
    const totalChecks = monitors.reduce((sum, m) => sum + (m.totalChecks || 0), 0);
    const totalSuccessful = monitors.reduce((sum, m) => sum + (m.successfullChecks || 0), 0);

    const avgUptime = totalChecks > 0
      ? (totalSuccessful / totalChecks) * 100
      : 0;

    return res.json({ uptime: Math.round(avgUptime * 100) / 100 });
  } catch (error) {
    console.error('Error fetching uptime percentage:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};