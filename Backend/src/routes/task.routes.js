import { Router } from "express";
import { verifyJWT, validateProjectPermission } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { UserRolesEnum } from "../utils/constants.js";
import {
  createTask,
  createSubTask,
  deleteTask,
  deleteSubTask,
  getTasks,
  getTaskById,
  updateTask,
  updateSubTask,
} from "../controllers/task.controllers.js";

const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

const { ADMIN, PROJECT_ADMIN, MEMBER } = UserRolesEnum;

// Route: /api/v1/tasks/:projectId
router
  .route("/:projectId")
  .get(validateProjectPermission([ADMIN, PROJECT_ADMIN, MEMBER]), getTasks)
  .post(
    validateProjectPermission([ADMIN, PROJECT_ADMIN]),
    upload.array("attachments"),
    createTask
  );

// Route: /api/v1/tasks/:projectId/t/:taskId
router
  .route("/:projectId/t/:taskId")
  .get(validateProjectPermission([ADMIN, PROJECT_ADMIN, MEMBER]), getTaskById)
  .put(validateProjectPermission([ADMIN, PROJECT_ADMIN]), updateTask)
  .delete(validateProjectPermission([ADMIN, PROJECT_ADMIN]), deleteTask);

// Route: /api/v1/tasks/:projectId/t/:taskId/subtasks
router
  .route("/:projectId/t/:taskId/subtasks")
  .post(validateProjectPermission([ADMIN, PROJECT_ADMIN]), createSubTask);

// Route: /api/v1/tasks/:projectId/st/:subtaskId
router
  .route("/:projectId/st/:subtaskId")
  .put(validateProjectPermission([ADMIN, PROJECT_ADMIN, MEMBER]), updateSubTask)
  .delete(validateProjectPermission([ADMIN, PROJECT_ADMIN]), deleteSubTask);

export default router;
