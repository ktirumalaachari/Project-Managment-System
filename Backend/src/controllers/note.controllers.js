import { Project } from "../models/project.models.js";
import { projectNote as Note } from "../models/Note.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";

const getNotes = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const notes = await Note.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("createdBy", "avatar username fullName");

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

const createNote = asyncHandler(async (req, res) => {
  const { title, content, task } = req.body;
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const note = await Note.create({
    title,
    content,
    project: new mongoose.Types.ObjectId(projectId),
    createdBy: new mongoose.Types.ObjectId(req.user?._id),
    task: task ? new mongoose.Types.ObjectId(task) : undefined,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, note, "Note Created Successfully"));
});

const getNoteById = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId).populate("createdBy", "avatar username fullName");

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note Fetched Successfully"));
});

const updateNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const { title, content } = req.body;
  
  const note = await Note.findById(noteId);
  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  if (title) note.title = title;
  if (content) note.content = content;

  await note.save();

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note Updated Successfully"));
});

const deleteNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  
  const note = await Note.findById(noteId);
  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  await note.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Note Deleted Successfully"));
});

export {
  getNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
};
