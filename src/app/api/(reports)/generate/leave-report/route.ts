import { Leave } from "@/models/leave.model";
// import { User } from "@/models/user.model";
// import { NextRequest, NextResponse } from "next/server";
// import { utils, WorkBook, write } from "xlsx";

// export async function GET(req: NextRequest) {
//   try {
//     const users = await User.find();

//     const data = await Leave.aggregate([
//       {
//         $lookup: {
//           from: "users", 
//           localField: "user_id", 
//           foreignField: "_id", 
//           as: "user", 
//         },
//       },
//       {
//         $lookup: {
//           from: "leavetypes", 
//           localField: "leave_type_id", 
//           foreignField: "_id", 
//           as: "leave_type", 
//         },
//       },
//       {
//         $lookup: {
//           from: "orgs", 
//           localField: "org_id",
//           foreignField: "_id", 
//           as: "organization", 
//         },
//       },
//       {
//         $lookup: {
//           from: "users", 
//           localField: "manager_id", 
//           foreignField: "_id", 
//           as: "manager", 
//         },
//       },
//       {
//         $unwind: "$user", 
//       },
//       {
//         $unwind: "$leave_type", 
//       },
//       {
//         $unwind: "$organization", 
//       },
//       {
//         $unwind: "$manager", 
//       },
//       {
//         $project: {
//           _id: 1, 
//           "user.name": 1, 
//           "user.email": 1,
//           "leave_type.name": 1,
//           "organization.name": 1, 
//           "manager.name": 1, 
//           start_date: 1, 
//           end_date: 1, 
//           description: 1, 
//           status: 1, 
//           docs: 1,
//         },
//       },
//     ]);

//     // Log the data
//     console.log(data);

//     const leave_data = data.map((leave_info:any) => ({
//       Name: leave_info.user.name,
//       Email: leave_info.user.email,
      
//     }));

//     return NextResponse.json({
//       msg: "Data Fetched",
//       data,
//     });

//     // const workbook: WorkBook = utils.book_new();
//     // const worksheet = utils.json_to_sheet(userData);

//     // utils.book_append_sheet(workbook, worksheet, "Users");

//     // const excelBuffer = write(workbook, { bookType: "xlsx", type: "buffer" });

//     // return new NextResponse(excelBuffer, {
//     //   status: 200,
//     //   headers: {
//     //     "Content-Disposition": 'attachment; filename="users_report.xlsx"',
//     //     "Content-Type":
//     //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     //   },
//     // });
//   } catch (error) {
//     return NextResponse.json(
//       {
//         msg: "Intenal Server Error",
//       },
//       { status: 500 }
//     );
//   }
// }
