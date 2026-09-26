import { Router } from "express";
import { verifyJWT, validateProjectPermission } from "../middlewares/auth.middleware.js";
import { UserRolesEnum } from "../utils/constants.js";
import {
  getNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/note.controllers.js";

const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

const { ADMIN, PROJECT_ADMIN, MEMBER } = UserRolesEnum;

// Route: /api/v1/notes/:projectId
router
  .route("/:projectId")
  .get(validateProjectPermission([ADMIN, PROJECT_ADMIN, MEMBER]), getNotes)
  .post(validateProjectPermission([ADMIN]), createNote);

// Route: /api/v1/notes/:projectId/n/:noteId
router
  .route("/:projectId/n/:noteId")
  .get(validateProjectPermission([ADMIN, PROJECT_ADMIN, MEMBER]), getNoteById)
  .put(validateProjectPermission([ADMIN]), updateNote)
  .delete(validateProjectPermission([ADMIN]), deleteNote);

export default router;
