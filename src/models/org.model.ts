import mongoose from "mongoose";

const org_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Org = mongoose.models.Org || mongoose.model("Org", org_schema);
