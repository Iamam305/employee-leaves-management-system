import { connect_db } from "@/configs/db";
import { Leave } from "@/models/leave.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connect_db();

export async function GET(req: NextRequest, content: any) {
  try {
    const id = await content.params.id;

    const user = await User.findById(id);

    // const leave = await Leave.find({
    //   user_id: user._id,
    // });

    const leaves = await Leave.aggregate([
      {
        $match: { user_id: user._id,
            status:"approved"
         },
      },
      {
        $group: {
          _id: "$user_id",
          leaves: {
            $push: {
              start: "$start_date",
              end: "$end_date",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          leaves: 1,
        },
      },
    ]);

    return NextResponse.json(
      {
        id,
        user,
        leaves,
        // leave,
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
