import mongoose from "mongoose";

const leave_type = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    org_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Org",
    },

    does_carry_forward: {
      type: Boolean,
    },
    count_per_month: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);


export const LeaveType = mongoose.models?.LeaveType || mongoose.model("LeaveType", leave_type);


