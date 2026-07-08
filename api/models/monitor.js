import mongoose from "mongoose";

const monitorSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["http", "ssl", "ping"],
      default: "http",
      required: true,
    },

    interval: {
      type: Number,
      enum: [1, 5, 10, 15, 30, 60],
      default: 5,
    },

    timeout: {
      type: Number,
      default: 10000,
    },

    expectedStatus: {
      type: Number,
      default: 200,
    },

    enabled: {
      type: Boolean,
      default: true,
    },

    lastChecked: {
      type: Date,
      default: null,
    },

    lastStatus: {
      type: String,
      enum: ["UP", "DOWN", "UNKNOWN"],
      default: "UNKNOWN",
    },

    // NEW FIELDS

    lastResponseTime: {
      type: Number,
      default: 0, // ms
    },

    uptimePercentage: {
      type: Number,
      default: 100,
    },

    totalChecks: {
      type: Number,
      default: 0,
    },

    successfulChecks: {
      type: Number,
      default: 0,
    },

    failedChecks: {
      type: Number,
      default: 0,
    },

    consecutiveFailures: {
      type: Number,
      default: 0,
    },

    errorMessage: {
      type: String,
      default: "",
    },

    nextCheck: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Monitor = mongoose.model("Monitor", monitorSchema);

export default Monitor;