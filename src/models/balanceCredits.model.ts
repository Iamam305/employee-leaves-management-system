import mongoose from "mongoose";

const balancesSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
    },
    annualCredit: {
      type: Number,
      default: 0,
    },
    annualUsed: {
      type: Number,
      default: 0,
    },
    annualAvailable: {
      type: Number,
      default: 0,
    },
    healthCredit: {
      type: Number,
      default: 0,
    },
    healthUsed: {
      type: Number,
      default: 0,
    },
    healthAvailable: {
      type: Number,
      default: 0,
    },
    studyCredit: {
      type: Number,
      default: 0,
    },
    studyUsed: {
      type: Number,
      default: 0,
    },
    studyAvailable: {
      type: Number,
      default: 0,
    },
    maternityCredit: {
      type: Number,
      default: 0,
    },
    maternityUsed: {
      type: Number,
      default: 0,
    },
    maternityAvailable: {
      type: Number,
      default: 0,
    },
    familyCredit: {
      type: Number,
      default: 0,
    },
    familyUsed: {
      type: Number,
      default: 0,
    },
    familyAvailable: {
      type: Number,
      default: 0,
    },
    paternityCredit: {
      type: Number,
      default: 0,
    },
    paternityUsed: {
      type: Number,
      default: 0,
    },
    paternityAvailable: {
      type: Number,
      default: 0,
    },
    unpaidUsed: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Balances = mongoose.models.Balances || mongoose.model("Balances", balancesSchema);
