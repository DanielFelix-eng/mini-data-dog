import express from "express";
import * as projectController from "../controlllers/projectController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/projects", verifyToken, projectController.createProject);
router.get("/projects", verifyToken, projectController.getProjects);
router.get("/projects/:id", verifyToken, projectController.getProject);
router.put("/projects/:id", verifyToken, projectController.updateProject);
router.delete("/projects/:id", verifyToken, projectController.deleteProject);

router.post("/", verifyToken, projectController.createProject);
router.get("/", verifyToken, projectController.getProjects);
router.get("/:id", verifyToken, projectController.getProject);
router.put("/:id", verifyToken, projectController.updateProject);
router.delete("/:id", verifyToken, projectController.deleteProject);

export default router;