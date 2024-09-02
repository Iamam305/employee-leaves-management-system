import { EmailVerification } from "@/components/email-temp/EmailVerificationTemplate";
import { LeaveRequestEmail } from "@/components/email-temp/LeaveRequestTemplate";
import { LeaveStatusEmail } from "@/components/email-temp/LeaveStatusTemplate";
import { connect_db } from "@/configs/db";
import { auth_middleware } from "@/lib/auth-middleware";
import { updateLeaveBalance } from "@/lib/balanceservices";
import { getDays } from "@/lib/utils";
import { LeaveType } from "@/models/leave-type.model";
import { Leave } from "@/models/leave.model";
import { Membership } from "@/models/membership.model";
import { User } from "@/models/user.model";
import dayjs from "dayjs";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

connect_db();

export const POST = async (req: NextRequest) => {
  try {
    const auth: any = await auth_middleware(req);
    if (
      auth[0] === null ||
      ["employee", "manager"].includes(auth[0]?.membership?.role)
    ) {
      return NextResponse.json(
        { msg: "Unauthorized, you don't have rights to assign a manager" },
        { status: 401 }
      );
    }

    const { managerId, userIds } = await req.json();

    const managerMembership = await Membership.findOne({ user_id: managerId });

    if (!managerMembership) {
      return NextResponse.json(
        { msg: "Manager not found in the organization" },
        { status: 404 }
      );
    }

    const result: any = await Membership.updateMany(
      { user_id: { $in: userIds } },
      { $set: { manager_id: managerId } }
    );

    if (result.nModified === 0) {
      return NextResponse.json(
        { msg: "No users were updated" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { msg: "Manager assigned to users successfully", result },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { msg: "Something went wrong", data: error },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    // Check authentication
    const auth: any = await auth_middleware(req);
    const org_id =
      req.nextUrl.searchParams.get("org_id") || auth[0]?.membership?.org_id;
    const name = req.nextUrl.searchParams.get("name");
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const limit = 10;
    const skip = (page - 1) * limit;
    const month = dayjs().month();

    // Authorization check
    if (auth[0] === null || auth[1] !== null) {
      console.error("Authentication error:", auth[1]);
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const auth_data = auth[0];
    let managerQuery: any = {};

    // Admin can view all managers, otherwise filter by org_id
    if (auth_data.membership.role === "admin") {
      managerQuery.role = "manager";
    } else if (
      ["hr", "manager", "employee"].includes(auth_data.membership.role)
    ) {
      managerQuery = { role: "manager", org_id: auth_data.membership.org_id };
    } else {
      return NextResponse.json(
        { msg: "Unauthorized, you don't have rights to view managers" },
        { status: 401 }
      );
    }

    // Filter by name if provided
    if (name) {
      managerQuery["user.name"] = { $regex: name, $options: "i" };
    }

    // Aggregation pipeline to fetch managers with pagination
    let managerAggregation: any[] = [
      { $match: managerQuery },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "orgs",
          localField: "org_id",
          foreignField: "_id",
          as: "org",
        },
      },
      { $unwind: "$org" },
      {
        $project: {
          "user.password": 0,
          "user.verification_code": 0,
          "user.createdAt": 0,
          "user.updatedAt": 0,
          "user.is_verified": 0,
        },
      },
    ];

    // Add sorting, skipping, and limiting for pagination
    managerAggregation.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    // Execute the aggregation
    const managers = await Membership.aggregate(managerAggregation);

    // Get the total number of managers for pagination
    const totalManagers = await Membership.countDocuments(managerQuery);
    const totalPages = Math.ceil(totalManagers / limit);

    return NextResponse.json(
      {
        managers,
        totalPages,
        currentPage: page,
        month,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching managers:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};
