import { auth_middleware } from "@/lib/auth-middleware";
import { Leave } from "@/models/leave.model";
import { Org } from "@/models/org.model";
import { NextRequest, NextResponse } from "next/server";
import { utils, WorkBook, write } from "xlsx";
const { ObjectId } = require("mongodb");

export async function GET(req: NextRequest) {
  try {
    const searchParams = await req.nextUrl.searchParams;
    const org_id = searchParams.get("org_id");
    const monthParam = searchParams.get("month");
    const auth: any = await auth_middleware(req);
    if (auth[0] === null || auth[1] !== null) {
      console.error("Authentication error:", auth[1]);
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }
    const auth_data: any = auth[0];
    const getOrgs = await Org.find({
      user_id: auth_data.user._id,
    });
    const orgIds = getOrgs.map((org) => org._id);
    let matchFilter: any = {};
    if (auth_data.membership.role === "admin") {
      if (org_id) {
        matchFilter = {
          org_id: new ObjectId(org_id),
        };
      } else {
        matchFilter = {
          org_id: { $in: orgIds },
        };
      }
    }
    if (auth_data.membership.role === "hr") {
      matchFilter = {
        org_id: auth_data.membership.org_id,
      };
    }

    if (monthParam) {
      const [year, month] = monthParam.split("-");
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      matchFilter.start_date = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const data = await Leave.aggregate([
      { $match: matchFilter },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "leavetypes",
          localField: "leave_type_id",
          foreignField: "_id",
          as: "leave_type",
        },
      },
      {
        $lookup: {
          from: "orgs",
          localField: "org_id",
          foreignField: "_id",
          as: "organization",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "manager_id",
          foreignField: "_id",
          as: "manager",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $unwind: "$leave_type",
      },
      {
        $unwind: "$organization",
      },
      {
        $unwind: {
          path: "$manager",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          "user.name": 1,
          "user.email": 1,
          "leave_type.name": 1,
          "organization.name": 1,
          "manager.name": 1,
          start_date: 1,
          end_date: 1,
          description: 1,
          status: 1,
          docs: 1,
        },
      },
    ]);

    console.log(data);

    // return NextResponse.json({
    //   //   auth_data,
    //   data,
    // });

    const leave_data = data.map((leave_info: any) => ({
      NAME: leave_info.user.name,
      EMAIL: leave_info.user.email,
      ORGANIZATION: leave_info.organization.name,
      MANAGER: leave_info?.manager?.name || "",
      LEAVE_TYPE: leave_info.leave_type.name,
      DESCRIPTION: leave_info.description,
      FROM: new Date(leave_info.start_date).toLocaleDateString(),
      TO: new Date(leave_info.end_date).toLocaleDateString(),
      STATUS: leave_info.status,
    }));
    const workbook: WorkBook = utils.book_new();
    const worksheet = utils.json_to_sheet(leave_data);

    worksheet["!cols"] = [
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 40 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];

    utils.book_append_sheet(workbook, worksheet, "Leave Info");
    const excelBuffer = write(workbook, { bookType: "xlsx", type: "buffer" });
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Disposition": 'attachment; filename="leave_report.xlsx"',
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        msg: error.message,
      },
      { status: 500 }
    );
  }
}
