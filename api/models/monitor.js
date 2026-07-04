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
      enum: [1, 5, 10, 15, 30, 60], // minutes
      default: 5,
    },

    timeout: {
      type: Number,
      default: 10000, // milliseconds
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
  },
  {
    timestamps: true,
  }
);

const Monitor = mongoose.model("Monitor", monitorSchema);

export default Monitor;