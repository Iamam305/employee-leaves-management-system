import { LeaveRequestEmail } from "@/components/email-temp/LeaveRequestTemplate";
import { connect_db } from "@/configs/db";
import { auth_middleware } from "@/lib/auth-middleware";
import { calculateLeaveBalance } from "@/lib/balanceservices";
import { LeaveType } from "@/models/leave-type.model";
import { Leave } from "@/models/leave.model";
import { Membership } from "@/models/membership.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

connect_db();

export const POST = async (req: NextRequest) => {
  try {
    const {
      user_id,
      leave_type_id,
      org_id,
      start_date,
      end_date,
      description,
      docs,
      manager_id,
    } = await req.json();

    if (
      !user_id ||
      !leave_type_id ||
      !org_id ||
      !start_date ||
      !end_date ||
      !manager_id
    ) {
      return NextResponse.json(
        { msg: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const membership = await Membership.findOne({ user_id })
      .populate("user_id")
      .populate("manager_id");

    if (!membership?.manager_id) {
      return NextResponse.json(
        { msg: "Manager not found for the user" },
        { status: 404 }
      );
    }

    const leavetype = await LeaveType.findById(leave_type_id);

    const leaveBalance = await calculateLeaveBalance(
      user_id,
      new Date(start_date).getFullYear(),
      leavetype.name
    );

    if (leaveBalance.total.available <= 0) {
      return NextResponse.json(
        {
          msg: "You cannot take this leave due to insufficient balance available",
        },
        { status: 403 }
      );
    } else {
      if (leaveBalance.monthly.available <= 0) {
        return NextResponse.json(
          {
            msg: "You cannot take this leave due to insufficient balance available",
          },
          { status: 403 }
        );
      }
    }

    // Create a new leave request
    const newLeave = new Leave({
      user_id,
      leave_type_id,
      org_id,
      start_date,
      end_date,
      description,
      docs,
      status: "pending",
      manager_id,
    });
    await newLeave.save();

    // Send message to manager
    const { data, error } = await resend.emails.send({
      from: "Acme <team@qtee.ai>",
      to: membership.manager_id.email,
      subject: "Leave Request Raised",
      react: LeaveRequestEmail({
        employeeName: membership.user_id.name,
        leaveStartDate: start_date,
        leaveEndDate: end_date,
        leaveReason: leavetype.name,
      }),
      html: "5",
    });

    return NextResponse.json(
      {
        msg: "Leave request created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while creating leave request:", error);
    return NextResponse.json({ msg: "Something went wrong" }, { status: 500 });
  }
};


// export const GET = async (req: NextRequest) => {
//   try {
//     const auth: any = await auth_middleware(req);
//     const org_id = req.nextUrl.searchParams.get("org_id");
//     const name = req.nextUrl.searchParams.get("name");
//     const status = req.nextUrl.searchParams.get("status");
//     const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
//     const limit = 10;
//     const skip = (page - 1) * limit;

//     // Authorization check
//     if (auth[0] === null || auth[1] !== null) {
//       console.error("Authentication error:", auth[1]);
//       return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
//     }

//     const auth_data = auth[0];
//     let leaveQuery: any = {};

//     // Role-based leave query filtering
//     if (auth_data.membership.role === "admin") {
//       // Admin can view leaves of all users
//       if (org_id) {
//         leaveQuery.org_id = new mongoose.Types.ObjectId(org_id);;
//       }
//     } else if (auth_data.membership.role === "hr") {
//       // HR can view leaves within their organization
//       leaveQuery.org_id = auth_data.membership.org_id;
//     } else if (auth_data.membership.role === "manager") {
//       // Managers can view leaves of users under their management
//       leaveQuery.manager_id = auth_data.membership.user_id;
//     } else {
//       // Employees can view only their own leaves
//       leaveQuery.user_id = auth_data.membership.user_id;
//     }

//     // Additional filters (status and name)
//     if (status) {
//       leaveQuery.status = status;
//     }

//     // Aggregation pipeline
//     let leaveAggregation: any[] = [
//       { $match: leaveQuery },
//       {
//         $lookup: {
//           from: "users",
//           localField: "user_id",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       { $unwind: "$user" },
//       {
//         $lookup: {
//           from: "leavetypes",
//           localField: "leave_type_id",
//           foreignField: "_id",
//           as: "leave_type",
//         },
//       },
//       { $unwind: "$leave_type" },
//       {
//         $lookup: {
//           from: "orgs",
//           localField: "org_id",
//           foreignField: "_id",
//           as: "org",
//         },
//       },
//       { $unwind: "$org" },
//       {
//         $project: {
//           "user.password": 0,
//           "user.verification_code": 0,
//           "user.createdAt": 0,
//           "user.updatedAt": 0,
//           "user.is_verified": 0,
//           leave_type_id: 0,
//           org_id: 0,
//           user_id: 0,
//           manager_id: 0,
//         },
//       },
//     ];

//     // Filter by employee name (case-insensitive)
//     if (name) {
//       leaveAggregation.push({
//         $match: {
//           "user.name": {
//             $regex: name,
//             $options: "i",
//           },
//         },
//       });
//     }

//     // Add sorting, skipping, and limiting for pagination
//     leaveAggregation.push(
//       { $sort: { createdAt: -1 } },
//       { $skip: skip },
//       { $limit: limit }
//     );

//     // Execute the aggregation
//     const leaves = await Leave.aggregate(leaveAggregation);

//     // Get the total number of leaves for pagination
//     const totalLeaves = await Leave.countDocuments(leaveQuery);
//     const totalPages = Math.ceil(totalLeaves / limit);

//     return NextResponse.json(
//       {
//         leaves,
//         totalPages,
//         currentPage: page,
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }


export const GET = async (req: NextRequest) => {
  try {
    const auth: any = await auth_middleware(req);
    const org_id = req.nextUrl.searchParams.get("org_id");
    const name = req.nextUrl.searchParams.get("name");
    const status = req.nextUrl.searchParams.get("status");
    const manager_id = req.nextUrl.searchParams.get("manager_id"); // Query param for filtering by manager
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const limit = 10;
    const skip = (page - 1) * limit;

    // Authorization check
    if (auth[0] === null || auth[1] !== null) {
      console.error("Authentication error:", auth[1]);
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const auth_data = auth[0];
    let leaveQuery: any = {};

    // Role-based leave query filtering
    if (auth_data.membership.role === "admin") {
      // Admin can view leaves of all users and can filter by org_id and manager_id
      if (org_id) {
        leaveQuery.org_id = new mongoose.Types.ObjectId(org_id);
      }
      if (manager_id) {
        leaveQuery.manager_id = new mongoose.Types.ObjectId(manager_id);
      }
    } else if (auth_data.membership.role === "hr") {
      // HR can only view leaves within their organization
      leaveQuery.org_id = auth_data.membership.org_id;

      // HR can filter by manager within their organization
      if (manager_id) {
        leaveQuery.manager_id = new mongoose.Types.ObjectId(manager_id);
      }
    } else if (auth_data.membership.role === "manager") {
      // Managers can view leaves of users under their management
      leaveQuery.manager_id = auth_data.membership.user_id;
    } else {
      // Employees can view only their own leaves
      leaveQuery.user_id = auth_data.membership.user_id;
    }

    // Additional filters (status and name)
    if (status) {
      leaveQuery.status = status;
    }

    // Aggregation pipeline
    let leaveAggregation: any[] = [
      { $match: leaveQuery },
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
          from: "leavetypes",
          localField: "leave_type_id",
          foreignField: "_id",
          as: "leave_type",
        },
      },
      { $unwind: "$leave_type" },
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
          leave_type_id: 0,
          org_id: 0,
          user_id: 0,
          manager_id: 0,
        },
      },
    ];

    // Filter by employee name (case-insensitive)
    if (name) {
      leaveAggregation.push({
        $match: {
          "user.name": {
            $regex: name,
            $options: "i",
          },
        },
      });
    }

    // Add sorting, skipping, and limiting for pagination
    leaveAggregation.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    // Execute the aggregation
    const leaves = await Leave.aggregate(leaveAggregation);

    // Get the total number of leaves for pagination
    const totalLeaves = await Leave.countDocuments(leaveQuery);
    const totalPages = Math.ceil(totalLeaves / limit);

    return NextResponse.json(
      {
        leaves,
        totalPages,
        currentPage: page,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};