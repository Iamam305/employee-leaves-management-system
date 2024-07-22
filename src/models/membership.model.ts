import mongoose from "mongoose";
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
      ref: "Org",
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

export const Membership =
  mongoose.models.Membership || mongoose.model("Membership", membership_schema);
// const membership_model = mongoose.model();

// export const Membership =
// (mongoose.models.Membership as typeof membership_model) || membership_model;
