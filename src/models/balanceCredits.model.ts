import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

export const Balances = mongoose.model("Balances", balanceSchema);
