import { Leave } from "@/models/leave.model";
import { NextRequest, NextResponse } from "next/server";
import { utils, WorkBook, write } from "xlsx";
const { ObjectId } = require("mongodb");

export async function GET(req: NextRequest, content: any) {
  try {
    const userId = await content.params.id;
    const data = await Leave.aggregate([
      {
        $match: {
          user_id: new ObjectId(userId),
        },
      },
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

    // return NextResponse.json(
    //   {
    //     msg: "fetched Id",
    //     userId,
    //     data,
    //   },
    //   { status: 200 }
    // );

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

    utils.book_append_sheet(workbook, worksheet, "Employee_Leave Info");
    const excelBuffer = write(workbook, { bookType: "xlsx", type: "buffer" });
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Disposition":
          'attachment; filename="employee_leave_report.xlsx"',
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        msg: "Inernal Server Error",
      },
      { status: 500 }
    );
  }
}
