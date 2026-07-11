import Settings from '../models/Settings.js';

export const getSettings = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;

    let settings = await Settings.findOne({ user: userId });

    if (!settings) {
      settings = await Settings.create({ user: userId });
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const updates = req.body;

    const allowedFields = [
      'defaultInterval',
      'defaultTimeout',
      'defaultExpectedStatus',
      'defaultEnabled',
      'notifications',
      'alertThresholds',
      'timezone',
      'theme',
    ];

    const filteredUpdates = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    const settings = await Settings.findOneAndUpdate(
      { user: userId },
      filteredUpdates,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetSettings = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;

    await Settings.findOneAndDelete({ user: userId });

    const settings = await Settings.create({ user: userId });

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};