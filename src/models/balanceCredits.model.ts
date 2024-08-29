import mongoose from "mongoose";

const leaveBalanceSchema = new mongoose.Schema({
  credit: { type: Number, default: 0 },
  used: { type: Number, default: 0 },
  available: { type: Number, default: 0 },
});

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
    org_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Org",
      required: true,
    },
    leaveBalances: {
      type: Map,
      of: new mongoose.Schema({
        total: {
          credit: { type: Number, default: 0 },
          used: { type: Number, default: 0 },
          available: { type: Number, default: 0 },
        },
        monthly: {
          type: Map,
          of: leaveBalanceSchema,
        },
      }),
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const Balances = mongoose?.models?.Balances || mongoose.model("Balances", balanceSchema);
