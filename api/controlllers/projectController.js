import * as projectService from "../services/proectService.js";

export const createProject = async (req, res) => {
  try {
    const ownerId = req.user?.id || req.userId;
    const project = await projectService.createProject({
      ...req.body,
      owner: ownerId,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const ownerId = req.user?.id || req.userId;
    const projects = await projectService.getProjects(ownerId);

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProject = async (req, res) => {
  try {
    const ownerId = req.user?.id || req.userId;
    const project = await projectService.getProjectById(
      req.params.id,
      ownerId
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const ownerId = req.user?.id || req.userId;
    const project = await projectService.updateProject(
      req.params.id,
      ownerId,
      req.body
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const ownerId = req.user?.id || req.userId;
    const project = await projectService.deleteProject(
      req.params.id,
      ownerId
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}; 