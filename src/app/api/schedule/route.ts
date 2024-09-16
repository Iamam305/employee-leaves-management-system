import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { Leave } from "@/models/leave.model";
import { connect_db } from "@/configs/db";

const resend = new Resend(process.env.RESEND_API_KEY);

connect_db();

export async function GET(req: NextRequest) {
  try {
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
        $group: {
          _id: "$manager._id",
          managerName: { $first: "$manager.name" },
          managerEmail: { $first: "$manager.email" },
          pendingLeavesCount: { $sum: 1 },
        },
      },
    ]);

    if (leaves.length > 0) {
      for (const leaveGroup of leaves) {
        const { managerEmail, managerName, pendingLeavesCount } = leaveGroup;

        const { data, error } = await resend.emails.send({
          from: "Ritik <team@qtee.ai>",
          to: managerEmail,
          subject: "Pending Leave Count",
          html: `<p>Hello ${managerName},</p>
                 <p>You have ${pendingLeavesCount} pending leave requests awaiting your approval.</p>
                 <p>Please review them at your earliest convenience.</p>`,
        });

        if (error) {
          console.error("Error sending email to manager:", error);
        } else {
          console.log("Email sent successfully to", managerEmail, ":", data);
        }
      }
    } else {
      console.log("No pending leaves found.");
    }
    return NextResponse.json(
      { msg: "Pending leave counts sent successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error occurred during execution:", error);
    return NextResponse.json(
      { msg: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
