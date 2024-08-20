import { connect_db } from "@/configs/db";
import { Leave } from "@/models/leave.model";
import { NextRequest, NextResponse } from "next/server";
const { ObjectId } = require("mongodb");

connect_db();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const user_id = searchParams.get("user_id");
    const org_id = searchParams.get("org_id");

    const accepted_leaves = await Leave.aggregate([
      {
        $match: {
          status: "approved",
          org_id: new ObjectId(org_id),
          user_id: new ObjectId(user_id),
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

    return NextResponse.json(
      {
        msg: "Api Working fine",
        accepted_leaves,
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
