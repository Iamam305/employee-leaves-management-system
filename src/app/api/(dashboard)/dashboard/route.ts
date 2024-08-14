import { connect_db } from "@/configs/db";
import { auth_middleware } from "@/lib/auth-middleware";
import { Leave } from "@/models/leave.model";
import { Membership } from "@/models/membership.model";
import { Org } from "@/models/org.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
const { ObjectId } = require("mongodb");

connect_db();

export async function GET(req: NextRequest) {
  try {
    const auth: any = await auth_middleware(req);
    const org_id = await req.nextUrl.searchParams.get("org_id");
    const auth_data = auth[0];

    const matchStage = org_id
      ? { $match: { org_id: new ObjectId(org_id) } }
      : { $match: {} };

    const users = await Membership.aggregate([
      matchStage,
      {
        $group: {
          _id: {
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
          totalUsers: { $sum: "$count" },
          users: { $push: { date: "$date", count: "$count" } },
        },
      },
      {
        $project: {
          _id: 0,
          totalUsers: 1,
          users: 1,
        },
      },
    ]);

    const leaves = await Leave.aggregate([
      matchStage,
      {
        $group: {
          _id: {
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
          totalLeaves: { $sum: "$count" },
          leaves: { $push: { date: "$date", count: "$count" } },
        },
      },
      {
        $project: {
          _id: 0,
          totalLeaves: 1,
          leaves: 1,
        },
      },
    ]);

    const matchStage_pending_leaves = (org_id: any) => {
      const matchStage: any = {
        status: "pending",
      };

      if (org_id) {
        matchStage.org_id = new ObjectId(org_id);
      }
      return { $match: matchStage };
    };

    const pending_leaves = await Leave.aggregate([
      matchStage_pending_leaves(org_id),
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
          totalPendingLeaves: { $sum: "$count" },
          pending_leaves: { $push: { date: "$date", count: "$count" } },
        },
      },
      {
        $project: {
          _id: 0,
          totalPendingLeaves: 1,
          pending_leaves: 1,
        },
      },
    ]);

    const leaves_data = await Leave.aggregate([
      matchStage,
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    return NextResponse.json(
      {
        leaves,
        users,
        leaves_data,
        pending_leaves,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
