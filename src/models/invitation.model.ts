import mongoose from "mongoose";

const invitation_schema = new mongoose.Schema({
  org: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Org",
  },
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Invitation =
  mongoose.models.Invitation || mongoose.model("Invitation", invitation_schema);
