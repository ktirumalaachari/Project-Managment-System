import mongoose, { Schema } from "mongoose";

// { AvailableTaskStatuses, TaskStatusEnum} from "../utils/constants.js";

const subTaskSchema = new Schema(
  {
    titel: {
      type: String,
      required: true,
      trim: true,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },

  { timestamps: true },
);

export const SubTask = mongoose.model("SubTask", subTaskSchema);
