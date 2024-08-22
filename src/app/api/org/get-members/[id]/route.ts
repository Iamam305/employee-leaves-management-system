import { connect_db } from "@/configs/db";
import { Leave } from "@/models/leave.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connect_db();

export async function GET(req: NextRequest, content: any) {
  try {
    const id = await content.params.id;
    const searchParams = req.nextUrl.searchParams;

    const month_param = searchParams.get("month");

    const user = await User.findById(id);

    const matchFilter: any = {
      user_id: user._id,
      status: "approved",
    };

    if (month_param) {
      const [year, month] = month_param.split("-");
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 1);

      matchFilter.start_date = {
        $gte: startDate,
        $lt: endDate, 
      };
    }

    const leaves = await Leave.aggregate([
      {
        $match: matchFilter
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
