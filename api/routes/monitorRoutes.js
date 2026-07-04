import express from 'express';
import Monitor from '../models/monitor.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/monitors', verifyToken, async (req, res) => {
  try {
    const monitors = await Monitor.find({ createdBy: req.user?.id || req.userId }).sort({ createdAt: -1 });
    res.status(200).json(monitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/monitors', verifyToken, async (req, res) => {
  try {
    const { project, type, interval, timeout, expectedStatus, enabled } = req.body;

    if (!project) {
      return res.status(400).json({ message: 'Project is required' });
    }

    const monitor = await Monitor.create({
      project,
      createdBy: req.user?.id || req.userId,
      type: type || 'http',
      interval: interval || 5,
      timeout: timeout || 10000,
      expectedStatus: expectedStatus || 200,
      enabled: enabled !== false,
    });

    res.status(201).json(monitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/monitors/:id', verifyToken, async (req, res) => {
  try {
    const monitor = await Monitor.findOne({
      _id: req.params.id,
      createdBy: req.user?.id || req.userId,
    });

    if (!monitor) {
      return res.status(404).json({ message: 'Monitor not found' });
    }

    res.status(200).json(monitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/monitors/:id', verifyToken, async (req, res) => {
  try {
    const monitor = await Monitor.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user?.id || req.userId,
      },
      req.body,
      { new: true }
    );

    if (!monitor) {
      return res.status(404).json({ message: 'Monitor not found' });
    }

    res.status(200).json(monitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/monitors/:id', verifyToken, async (req, res) => {
  try {
    const monitor = await Monitor.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user?.id || req.userId,
    });

    if (!monitor) {
      return res.status(404).json({ message: 'Monitor not found' });
    }

    res.status(200).json({ message: 'Monitor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
