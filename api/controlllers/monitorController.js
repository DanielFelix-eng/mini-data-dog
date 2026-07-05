
import Monitor from "../models/monitor.js";
import Project from "../models/Project.js";

// Create Monitor
export const createMonitor = async (req, res) => {
  try {
    const {
      project,
      type,
      interval,
      timeout,
      expectedStatus,
      enabled,
    } = req.body;

    const existingProject = await Project.findOne({
      _id: project,
      createdBy: req.user.id,
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const monitor = await Monitor.create({
      project,
      createdBy: req.user.id,
      type,
      interval,
      timeout,
      expectedStatus,
      enabled,
    });

    return res.status(201).json({
      success: true,
      message: "Monitor created successfully",
      monitor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Monitors
export const getMonitors = async (req, res) => {
  try {
    const monitors = await Monitor.find({
      createdBy: req.user.id,
    }).populate("project");

    return res.status(200).json({
      success: true,
      count: monitors.length,
      monitors,
    });
  } catch (error) {
     
res.status(500).json(message , 'error.message');
} 
}