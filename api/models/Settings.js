import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    defaultInterval: {
      type: Number,
      enum: [1, 5, 10, 15, 30, 60],
      default: 5,
    },

    defaultTimeout: {
      type: Number,
      default: 10000,
    },

    defaultExpectedStatus: {
      type: Number,
      default: 200,
    },

    defaultEnabled: {
      type: Boolean,
      default: true,
    },

    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: false,
      },
      onDown: {
        type: Boolean,
        default: true,
      },
      onUp: {
        type: Boolean,
        default: true,
      },
      onTimeout: {
        type: Boolean,
        default: true,
      },
    },

    alertThresholds: {
      consecutiveFailures: {
        type: Number,
        default: 3,
      },
      responseTimeMs: {
        type: Number,
        default: 5000,
      },
    },

    timezone: {
      type: String,
      default: 'UTC',
    },

    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;