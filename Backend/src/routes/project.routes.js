import { Router } from "express";
import {
    addMembersToProject,
  createProject,
  deleteProject,
  getProjects,
  getProjectById,
  getProjectMembers,
  updateProject,
  updateMemberRole,
  deleteMemberRole,
} from "../controllers/project.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { createProjectValidator, addMembertoProjectValidator, updateMemberRoleValidator, deleteMemberRoleValidator, projectParamsValidator, updateProjectValidator } from "../validators/index.js";
import { verifyJWT, validateProjectPermission } from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const router = Router();
router.use(verifyJWT)

router
    .route("/")
    .get(getProjects)
    .post(createProjectValidator(), validate, createProject)

router
    .route("/:projectId")
    .get(validateProjectPermission(AvailableUserRole), getProjectById)
    .put(validateProjectPermission([UserRolesEnum.ADMIN]), updateProjectValidator(), validate, updateProject)
    .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteProject)

router
    .route("/:projectId/members")
    .get(getProjectMembers)
    .post(validateProjectPermission([UserRolesEnum.ADMIN]), addMembertoProjectValidator(), validate, addMembersToProject)

router
    .route("/:projectId/members/:userId")
    .put(validateProjectPermission([UserRolesEnum.ADMIN]), updateMemberRoleValidator(), validate, updateMemberRole)
    .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteMemberRoleValidator(), validate, deleteMemberRole)

export default router