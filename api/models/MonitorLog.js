import mongoose from "mongoose";

const monitorLogSchema = new mongoose.Schema(
  {
    monitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monitor",
      required: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    status: {
      type: String,
      enum: ["UP", "DOWN"],
      required: true,
    },

    statusCode: {
      type: Number,
      default: null,
    },

    responseTime: {
      type: Number,
      default: 0, // milliseconds
    },

    checkedAt: {
      type: Date,
      default: Date.now,
    },

    error: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Automatically delete logs after 30 days
monitorLogSchema.index({ checkedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

const MonitorLog = mongoose.model("MonitorLog", monitorLogSchema);

export default MonitorLog;