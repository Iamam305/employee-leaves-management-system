import { connect_db } from "@/configs/db";
import { Balances } from "@/models/balanceCredits.model";
import { Leave } from "@/models/leave.model";
import { NextRequest, NextResponse } from "next/server";
const { ObjectId } = require("mongodb");

connect_db();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const user_id = searchParams.get("user_id");
    // const org_id = searchParams.get("org_id");
    const monthYear = searchParams.get("monthYear");

    const matchFilter: any = {};

    if (monthYear) {
      const [year, month] = monthYear.split("-").map(Number);
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);

      matchFilter.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    const accepted_leaves = await Leave.aggregate([
      {
        $match: {
          status: "approved",
          // org_id: new ObjectId(org_id),
          user_id: new ObjectId(user_id),
          ...matchFilter,
        },
      },
      {
        $group: {
          _id: {
            status: "$status",
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          count: 1,
          firstCreatedAt: 1,
        },
      },
      {
        $group: {
          _id: null,
          totalAcceptedLeaves: { $sum: "$count" },
          accepted_leaves: { $push: { date: "$date", count: "$count" } },
        },
      },
      {
        $project: {
          _id: 0,
          totalAcceptedLeaves: 1,
          accepted_leaves: 1,
        },
      },
    ]);

    const rejected_leaves = await Leave.aggregate([
      {
        $match: {
          status: "rejected",
          // org_id: new ObjectId(org_id),
          user_id: new ObjectId(user_id),
          ...matchFilter,
        },
      },
      {
        $group: {
          _id: {
            status: "$status",
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          count: 1,
        },
      },
      {
        $group: {
          _id: null,
          totalRejectedLeaves: { $sum: "$count" },
          rejecetd_leaves: { $push: { date: "$date", count: "$count" } },
        },
      },
      {
        $project: {
          _id: 0,
          totalRejectedLeaves: 1,
          rejecetd_leaves: 1,
        },
      },
    ]);

    const totalLeaves = await Leave.aggregate([
      {
        $match: {
          // org_id: new ObjectId(org_id),
          user_id: new ObjectId(user_id),
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }, 
        },
      },
      {
        $group: {
          _id: null, 
          leavesByStatus: { $push: { status: "$_id", count: "$count" } }, 
          totalLeaves: { $sum: "$count" }, 
        },
      },
      {
        $project: {
          _id: 0,
          leavesByStatus: 1,
          totalLeaves: 1, 
        },
      },
    ]);

    const balances= await Balances.find(
      { userId: user_id },
      { leaveBalances: 1, _id: 0 }
    );

    return NextResponse.json(
      {
        msg: "Api Working fine",
        balances,
        totalLeaves,
        accepted_leaves,
        rejected_leaves,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        msg: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
