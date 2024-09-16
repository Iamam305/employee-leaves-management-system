import mongoose from "mongoose";
import { Resend } from "resend";
import { LeaveStatusEmail } from "@/components/email-temp/LeaveStatusTemplate";
import { Leave } from "@/models/leave.model";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  try {
    if (!mongoose.connection.readyState) {
      return NextResponse.json(
        { msg: "Mongoose is not connected. Skipping job." },
        { status: 500 }
      );
    }

    const leaves = await Leave.aggregate([
      { $match: { status: "pending" } },
      {
        $lookup: {
          from: "users",
          localField: "manager_id",
          foreignField: "_id",
          as: "manager",
        },
      },
      { $unwind: "$manager" },
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
        $project: {
          _id: 1,
          status: 1,
          "manager.name": 1,
          "manager.email": 1,
          start_date: 1,
          end_date: 1,
          "leave_type.name": 1,
        },
      },
    ]);

    if (leaves.length > 0) {
      for (const leave of leaves) {
        const formattedStartDate = dayjs(leave.start_date).format("YYYY-MM-DD");
        const formattedEndDate = dayjs(leave.end_date).format("YYYY-MM-DD");

        const { data, error } = await resend.emails.send({
          from: "Acme <team@qtee.ai>",
          to: `${leave.manager.email}`,
          subject: "Leave Status Changed",
          react: LeaveStatusEmail({
            employeeName: leave.manager.name,
            leaveStartDate: formattedStartDate,
            leaveEndDate: formattedEndDate,
            leaveReason: leave.leave_type.name,
            StatusOfLeave: leave.status,
          }),
          html: "<p>Leave status has been updated. Please check the details.</p>",
        });

        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent successfully:", data);
        }
      }
    } else {
      console.log("No pending leaves.");
    }

    return NextResponse.json(
      { msg: "Task executed successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { msg: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
