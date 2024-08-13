import { connect_db } from "@/configs/db";
import { Leave } from "@/models/leave.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connect_db();

export async function GET(req: NextRequest) {
  try {
    const from = req.nextUrl.searchParams.get("from");
    const to = req.nextUrl.searchParams.get("to");
    const pipeline: any = [];
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);

      pipeline.push({
        $match: {
          createdAt: { $gte: fromDate, $lte: toDate },
        },
      });
    }

    pipeline.push(
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
      }
    );

    const users = await User.aggregate(pipeline);

    // const users = await User.aggregate([
    //   {
    //     $match: {
    //       createdAt: { $gte: from, $lte: to },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         year: { $year: "$createdAt" },
    //         month: { $month: "$createdAt" },
    //         day: { $dayOfMonth: "$createdAt" },
    //       },
    //       count: { $sum: 1 },
    //     },
    //   },
    //   {
    //     $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       date: {
    //         $dateFromParts: {
    //           year: "$_id.year",
    //           month: "$_id.month",
    //           day: "$_id.day",
    //         },
    //       },
    //       count: 1,
    //     },
    //   },
    // ]);

    const leaves = await Leave.aggregate([
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

    console.log(leaves);

    const pending_leaves = await Leave.aggregate([
      {
        $match: {
          status: "rejected",
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

    console.log(pending_leaves);

    const leaves_data = await Leave.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    return NextResponse.json(
      {
        // top_users_leaves,
        leaves_data,
        pending_leaves,
        users,
        leaves,
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
