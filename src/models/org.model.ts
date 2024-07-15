import mongoose from "mongoose";

const org_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Org = mongoose.models.Org || mongoose.model("Org", org_schema);
