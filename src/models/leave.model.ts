import mongoose, { Mongoose } from "mongoose";

const leave_schema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    leave_type_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "LeaveType",
    },
    org_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Org",
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
    },
    docs: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    manager_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    }
  },
  {
    timestamps: true,
  }
);

export const Leave =
  mongoose.models.Leave || mongoose.model("Leave", leave_schema);
