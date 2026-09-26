import { User } from "../models/user.model.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.model.js";
import { SubTask } from "../models/subtask.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const getTasks = asyncHandler(async (req, res) => {
  const { ProjectId } = req.params;
  const project = await Project.findById(ProjectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(ProjectId),
  }).populate("assignedTo", "avatar username fullname");

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { ProjectId } = req.params;
  const project = await Project.findById(ProjectId);

  if (!project) {
    throw new ApiError(404, "project not found");
  }
  const files = req.files || [];

  const attachments = files.map((file) => {
    return {
      url: `${process.env.SERVER_URL}/images/${file.originalname}`,
      mimetype: file.mimetype,
      size: file.size,
      originalName: file.originalname,
      localPath: file.path,
    };
  });

  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(ProjectId),
    assignedTo: assignedTo
      ? new mongoose.Types.ObjectId(assignedTo)
      : undefined,
    status,
    assignedBy: new mongoose.Types.ObjectId(req.user?._id),
    attachments,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task Created Succesfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            _id: 1,
            username: 1,
            fullName: 1,
            avatar: 1,
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
              pipeline:[
                {
                  $project:
                  {
                    _id:1,
                    username:1,
                    fullName:1,
                    avatar:1
                }
                }
              ]
            },
          },
          {
            $addFields:{
                createdBy: {
                    $arrayElemAt: ["$$createdBy", 0]
                }
            }
          }
        ],
      },
    },
    {
        $addFields:{
            assignedTo: {
                $arrayElemAt: ["$$assignedTo", 0]
            },
        }
    }
  ]);

  if (!task || task.length === 0) {
    throw new ApiError(404, "task not found")
  }
  return res
    .status(200)
    .json(new ApiResponse(200,task[0],"Task Fatched Successfully"))
});

const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const {title,description,assignedTo,status} = req.body;
  const task = await Task.findById(taskId);
  if(!task){
    throw new ApiError(404, "task not found")
  }
  if(title){
    task.title = title;
  }
  if(description){
    task.description = description;
  }
  if(assignedTo){
    task.assignedTo = new mongoose.Types.ObjectId(assignedTo);
  }
  if(status){
    task.status = status;
  }
  await task.save();
  return res
    .status(200)
    .json(new ApiResponse(200,task,"Task Updated Successfully"))
});

const deleteTask = asyncHandler(async (req, res) => {
  const {taskId} = req.params;
  const task = await Task.findById(taskId);
  if(!task){
    throw new ApiError(404, "task not found")
  }
  await task.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200,{},"Task Deleted Successfully"))
});

const createSubTask = asyncHandler(async (req, res) => {
  const {taskId} = req.params;
  const {title,description} = req.body;
  const task = await Task.findById(taskId);
  if(!task){
    throw new ApiError(404, "task not found")
  }
  const subTask = await SubTask.create({
    title,
    description,
    task: new mongoose.Types.ObjectId(taskId),
    createdBy: new mongoose.Types.ObjectId(req.user?._id),
  });
  return res
    .status(201)
    .json(new ApiResponse(201,subTask,"Sub Task Created Successfully"))
});

const updateSubTask = asyncHandler(async (req, res) => {
  const {subtaskId} = req.params;
  const {title,description,status} = req.body;
  const subTask = await SubTask.findById(subtaskId);
  if(!subTask){
    throw new ApiError(404, "sub task not found")
  }
  if(title){
    subTask.title = title;
  }
  if(description){
    subTask.description = description;
  }
  if(status){
    subTask.status = status;
  }
  await subTask.save();
  return res
    .status(200)
    .json(new ApiResponse(200,subTask,"Sub Task Updated Successfully"))
});

const deleteSubTask = asyncHandler(async (req, res) => {
  const {subtaskId} = req.params;
  const subTask = await SubTask.findById(subtaskId);
  if(!subTask){
    throw new ApiError(404, "sub task not found")
  }
  await subTask.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200,{},"Sub Task Deleted Successfully"))
});

export {
  createTask,
  createSubTask,
  deleteTask,
  deleteSubTask,
  getTasks,
  getTaskById,
  updateTask,
  updateSubTask,
};
