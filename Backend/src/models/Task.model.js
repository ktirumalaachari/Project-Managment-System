import mongoose, { Schema } from "mongoose";

import { AvailableTaskStatuses, TaskStatusEnum } from "../utils/constants.js";

const TaskSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  assignedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: AvailableTaskStatuses,
    default: TaskStatusEnum.TODO,
  },
  attachments: {
    type: [
      {
        url: String,
        mintype: String,
        size: Number,
      },
    ],
    default: [],
  },
},
{timestamps: true}
);

export const Task = mongoose.model("Task",TaskSchema)
