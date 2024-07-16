import mongoose, { InferSchemaType } from "mongoose";
const schema = {};
const membership_schema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    org_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "hr", "manager", "employee"],
    },
    manager_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const membership_model = mongoose.model("Membership", membership_schema);

export const Membership =
  (mongoose.models.Membership as typeof membership_model) || membership_model;
