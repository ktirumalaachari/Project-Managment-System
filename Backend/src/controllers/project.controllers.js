import { User } from "../models/user.model.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/ProjectMember.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";


const getProjects = asyncHandler(async (req, res) => {
  const project = await ProjectMember.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
        pipeline: [
          {
            $lookup: {
              from: "projectmembers",
              localField: "_id",
              foreignField: "projects",
              as: "projectMembers",
            },
          },
          {
            $addFields: {
              members: { $size: "$projectMembers" },
            },
          },
          {
            $unwind: "$project",
          },
          {
            $project: {
              _id: 1,
              name: 1,
              description: 1,
              members: 1,
              createdAt: 1,
              createdBy: 1,
            },
            role: 1,
            _id: 0,
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Projects fetched successfully"));
});

const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project fetched successfully"));
});

const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const project = await Project.create({
    name,
    description,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  await ProjectMember.create({
    user: new mongoose.Types.ObjectId(req.user._id),
    project: project._id,
    role: UserRolesEnum.ADMIN,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, project, "Project created successfully"));
});

const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const { projectId } = req.params;

  const project = await Project.findByIdAndUpdate(
    projectId,
    {
      name,
      description,
    },
    {
      new: true,
    },
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project updated successfully"));
});

const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findByIdAndDelete(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project deleted successfully"));
});

const addMembersToProject = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const { projectId } = req.params;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const projectMember = await ProjectMember.findByIdAndUpdate(
    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
    },
    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
      role: role,
    },
    {
      new: true,
      upsert: true,
    },
  );

  return res
    .status(201)
    .json(new ApiResponse(201, projectMember, "Member added successfully"));
});

const getProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const projectMembers = await ProjectMember.find({
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!projectMembers) {
    throw new ApiError(404, "Project members not found");
  }

  const projectMember = await ProjectMember.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        user: {
          $arrayElemAt: ["$user", 0],
        },
      },
    },
    {
      $project: {
        project: 1,
        user: 1,
        role: 1,
        createdAt: 1,
        updatedAt: 1,
        _id: 0,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        projectMembers,
        "Project members fetched successfully",
      ),
    );
});

const updateMemberRole = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;
  const { newRole } = req.body;

  if (!AvailableUserRole.includes(newRole)) {
    throw new ApiError(400, "Invalid role");
  }

  const projectMember = await ProjectMember.findOneAndUpdate(
    {
      user: new mongoose.Types.ObjectId(userId),
      project: new mongoose.Types.ObjectId(projectId),
    },
    {
      role: newRole,
    },
    {
      new: true,
    },
  );

  if (!projectMember) {
    throw new ApiError(404, "Project Member Not Found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, projectMember, "Member role updated successfully"),
    );
});

const deleteMemberRole = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;
  const { role } = req.body;

  if (!AvailableUserRole.includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  let projectMember = await ProjectMember.findOneAndDelete({
    user: new mongoose.Types.ObjectId(userId),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!projectMember) {
    throw new ApiError(404, "Project Member Not Found");
  }

  projectMember.role = await ProjectMember.findByIdAndDelete(
    projectMember._id,
  );

  if (!projectMember) {
    throw new ApiError(404, "Project Member Not Found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, projectMember, "Member role deleted successfully"),
    );
});

export {
  addMembersToProject,
  createProject,
  deleteProject,
  getProjects,
  getProjectById,
  getProjectMembers,
  updateProject,
  updateMemberRole,
  deleteMemberRole,
};
