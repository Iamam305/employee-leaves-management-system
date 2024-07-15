import mongoose from "mongoose";

const membership_schema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    org_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "hr", "manager", "employee"],
    },
  },
  {
    timestamps: true,
  }
);

export const Membership =
  mongoose.models.Membership || mongoose.model("Membership", membership_schema);
