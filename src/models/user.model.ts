import mongoose from "mongoose";

const user_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    is_verified: {
      type: Boolean,
      default: false,
    },

    verification_code: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const user_model = mongoose.model("User", user_schema);
export const User = mongoose.models.User || user_model;
