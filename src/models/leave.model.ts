import mongoose from "mongoose";

const leave_schema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    leave_type_id: {
      type: mongoose.Types.ObjectId,
      required: true,
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
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Leave =
  mongoose.models.Leave || mongoose.model("Leave", leave_schema);