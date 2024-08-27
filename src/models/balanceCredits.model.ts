import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    leaveBalances: {
      type: Map,
      of: {
        credit: { type: Number, default: 0 },
        used: { type: Number, default: 0 },
        available: { type: Number, default: 0 },
      },
      default: {},
    },
    org_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Org",
      required: true,
  },
  },
  {
    timestamps: true,
  }
);

export const Balances = mongoose?.models?.Balances || mongoose.model("Balances", balanceSchema);
