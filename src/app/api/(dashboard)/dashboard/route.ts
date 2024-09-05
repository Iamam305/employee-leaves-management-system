import { connect_db } from "@/configs/db";
import { auth_middleware } from "@/lib/auth-middleware";
import { Balances } from "@/models/balanceCredits.model";
import { LeaveType } from "@/models/leave-type.model";
import { Leave } from "@/models/leave.model";
import { Membership } from "@/models/membership.model";
import { Org } from "@/models/org.model";
import { NextRequest, NextResponse } from "next/server";
const { ObjectId } = require("mongodb");

connect_db();

export async function GET(req: NextRequest) {
  try {
    const auth: any = await auth_middleware(req);
    const org_id = await req.nextUrl.searchParams.get("org_id");

    if (auth[0] === null || auth[1] !== null) {
      console.error("Authentication error:", auth[1]);
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const auth_data = auth[0];

    const getOrgs = await Org.find({
      user_id: auth_data.user._id,
    });

    const orgIds = getOrgs.map((org) => org._id);

    if (auth_data.membership.role === "admin") {
      const matchStage = org_id
        ? { $match: { org_id: new ObjectId(org_id) } }
        : { $match: { org_id: { $in: orgIds } } };

      const matchStage_pending_leaves = (org_id: any) => {
        const matchStage: any = {
          status: "pending",
        };
        if (org_id) {
          matchStage.org_id = new ObjectId(org_id);
        } else {
          matchStage.org_id = { $in: orgIds };
        }
        return { $match: matchStage };
      };
      const [users, leaves, pending_leaves, leaves_data, leaveType] =
        await Promise.all([
          await Membership.aggregate([
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
          ]),

          // For Leaves
          Leave.aggregate([
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
          ]),

          // For Pending Leaves
          Leave.aggregate([
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
          ]),

          // For Leaves Data
          Leave.aggregate([
            matchStage,
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ]),

          // For leave Type
          LeaveType.aggregate([
            matchStage,
            {
              $group: {
                _id: "$name",
                count_per_month: { $sum: "$count_per_month" },
              },
            },
            {
              $project: {
                _id: 0,
                name: "$_id",
                count_per_month: 1,
              },
            },
            {
              $facet: {
                leaveTypes: [{ $sort: { name: 1 } }],
                total: [
                  {
                    $group: {
                      _id: null,
                      totalCount: { $sum: "$count_per_month" },
                    },
                  },
                  { $project: { _id: 0, totalCount: 1 } },
                ],
              },
            },
          ]),
        ]);
      const leaveTypes = leaveType[0].leaveTypes;
      const total = leaveType[0].total[0]?.totalCount || 0;

      console.log("Leave Types Data:", leaveTypes);
      console.log("Total Count per Month:", total);

      return NextResponse.json(
        {
          leaveType,
          leaves,
          users,
          leaves_data,
          pending_leaves,
        },
        { status: 200 }
      );
    } else if (auth_data.membership.role === "hr") {
      const [users, leaves, pending_leaves, leaves_data, leaveType] =
        await Promise.all([
          Membership.aggregate([
            {
              $match: {
                org_id: auth_data.membership.org_id,
              },
            },
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
          ]),

          await Leave.aggregate([
            {
              $match: {
                org_id: auth_data.membership.org_id,
              },
            },
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
          ]),

          Leave.aggregate([
            {
              $match: {
                status: "pending",
                org_id: auth_data.membership.org_id,
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
          ]),

          await Leave.aggregate([
            {
              $match: {
                org_id: auth_data.membership.org_id,
              },
            },
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ]),
          LeaveType.aggregate([
            {
              $match: {
                org_id: auth_data.membership.org_id,
              },
            },
            {
              $group: {
                _id: "$name",
                count_per_month: { $sum: "$count_per_month" },
              },
            },
            {
              $project: {
                _id: 0,
                name: "$_id",
                count_per_month: 1,
              },
            },
            {
              $facet: {
                leaveTypes: [{ $sort: { name: 1 } }],
                total: [
                  {
                    $group: {
                      _id: null,
                      totalCount: { $sum: "$count_per_month" },
                    },
                  },
                  { $project: { _id: 0, totalCount: 1 } },
                ],
              },
            },
          ]),
        ]);
      return NextResponse.json({
        msg: "You are hr",
        leaveType,
        users,
        leaves,
        pending_leaves,
        leaves_data,
      });
    } else if (auth_data.membership.role === "manager") {
      const [users, leaves, leaveType, pending_leaves, leaves_data] =
        await Promise.all([
          Membership.aggregate([
            {
              $match: {
                org_id: auth_data.membership.org_id,
                manager_id: auth_data.membership.user_id,
              },
            },
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
          ]),
          Leave.aggregate([
            {
              $match: {
                org_id: auth_data.membership.org_id,
                manager_id: auth_data.membership.user_id,
              },
            },
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
          ]),

          LeaveType.aggregate([
            {
              $match: {
                org_id: auth_data.membership.org_id,
              },
            },
            {
              $group: {
                _id: "$name",
                count_per_month: { $sum: "$count_per_month" },
              },
            },
            {
              $project: {
                _id: 0,
                name: "$_id",
                count_per_month: 1,
              },
            },
            {
              $facet: {
                leaveTypes: [{ $sort: { name: 1 } }],
                total: [
                  {
                    $group: {
                      _id: null,
                      totalCount: { $sum: "$count_per_month" },
                    },
                  },
                  { $project: { _id: 0, totalCount: 1 } },
                ],
              },
            },
          ]),

          Leave.aggregate([
            {
              $match: {
                status: "pending",
                org_id: auth_data.membership.org_id,
                manager_id: auth_data.membership.user_id,
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
          ]),

          Leave.aggregate([
            {
              $match: {
                org_id: auth_data.membership.org_id,
                manager_id: auth_data.membership.user_id,
              },
            },
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ]),
        ]);

      return NextResponse.json({
        msg: "You are Manager",
        leaveType,
        users,
        leaves,
        pending_leaves,
        leaves_data,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
