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
    ]);

    // const pending_leaves = await Leave.find({
    //   status: { $eq: "approved" }
    // })

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
    ]);

    // const leaves_data = await Leave.find({
    //     status:{$eq:"approved"}
    // })

    const leaves_data = await Leave.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);


    // const top_users_leaves = await Leave.find({
    //   status:{$eq:"approved"}
    // }).populate("user_id")

    // const top_users_leaves = await Leave.aggregate([
    //   {
    //     $match: {
    //       status: "approved",
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$user_id",
    //       count: { $sum: 1 },
    //     },
    //   },
    //   {
    //     $sort: { count: -1 }, // Sort by count in descending order
    //   },
    //   {
    //     $limit: 10, 
    //   },
    //   {
    //     $lookup: {
    //       from: "users", // The name of the users collection
    //       localField: "_id", // The user_id field in Leave collection
    //       foreignField: "_id", // The _id field in Users collection
    //       as: "user_details",
    //     },
    //   },
    //   {
    //     $unwind: "$user_details", // Unwind the array to get user details as an object
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       user: "$user_details", // Include user details
    //       leaves_taken: "$count", // Include the count of leaves
    //     },
    //   },
    // ]);
    
    // console.log(top_users_leaves);
    


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
