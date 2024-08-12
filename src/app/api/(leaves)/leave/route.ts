import { EmailVerification } from "@/components/email-temp/EmailVerificationTemplate";
import { LeaveRequestEmail } from "@/components/email-temp/LeaveRequestTemplate";
import { connect_db } from "@/configs/db";
import { LeaveType } from "@/models/leave-type.model";
import { Leave } from "@/models/leave.model";
import { Org } from "@/models/org.model";
import { User } from "@/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

connect_db();


export const POST = async (req : NextRequest) => {
    try {

        // Extract data from the request body
        const { user_id, leave_type_id, org_id, start_date, end_date, description } = await req.json();

        // Validate required fields
        if (!user_id || !leave_type_id || !org_id || !start_date || !end_date) {
            return NextResponse.json({ msg: "All required fields must be provided" }, { status: 400 });
        }

        // Create a new leave request
        const newLeave = new Leave({
            user_id,
            leave_type_id,
            org_id,
            start_date,
            end_date,
            description,
            status: "pending",
        });

        // Save the new leave request to the database
        await newLeave.save();

        const user = await User.findById(user_id);

        const leavetype = await LeaveType.findById(leave_type_id)

        // send message to manager
        const { data, error } = await resend.emails.send({
            from: "Acme <team@qtee.ai>",
            to: "sgrlekhwani@gmail.com",
            subject: "Leave Request Raised",
            react: LeaveRequestEmail({
                employeeName : user.name,
                leaveStartDate : start_date,
                leaveEndDate : end_date,
                leaveReason : leavetype.name,
            }),
            html: "5",
          });

        //if not manager than send to hr or admin


        // Respond with the created leave request
        return NextResponse.json({ msg: "Leave request created successfully", data: {newLeave , data} }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ msg: "Something went wrong" }, { status: 500 });
    }
};



// export const GET = async (req: NextRequest) => {
//     try {
//         const leaves = await Leave.find().populate('user_id' ,  "-password -createdAt -updatedAt -verification_code -is_verified").populate("leave_type_id").populate("org_id" , [] , Org);
//         return NextResponse.json({ msg: "All Leaves fetched Successfully" , data: leaves}, { status: 200 });
        
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({ msg: "Something went wrong" }, { status: 500 });        
//     }
// }

export async function GET(req: NextRequest) {
    try {
      const org_id = req.nextUrl.searchParams.get("org_id");
      const name = req.nextUrl.searchParams.get("name");
      const status = req.nextUrl.searchParams.get("status");
      const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
      const limit = 10;
      const skip = (page - 1) * limit;
  
      // Build the query for leaves
      let leaveQuery: any = {};
    //   if (org_id) {
    //     leaveQuery.org._id = org_id;
    //   }
    //   if (name) {
    //     leaveQuery.user_id.name = name;
    //   }
      if (status) {
        leaveQuery.status = status;
      }
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
        {
          $unwind: "$user",
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
          $unwind: "$leave_type",
        },
        {
          $lookup: {
            from: "orgs",
            localField: "org_id",
            foreignField: "_id",
            as: "org",
          },
        },
        {
          $unwind: "$org",
        },
        {
          $project: {
            "user.password": 0, // Exclude password
            "user.verification_code": 0, // Exclude verification_code
            "user.createdAt": 0, // Exclude createdAt
            "user.updatedAt": 0, // Exclude updatedAt
            "user.is_verified": 0, // Exclude is_verified
            "leave_type_id": 0, // Exclude leave_type id
            "org_id": 0, // Exclude org id
            "user_id": 0, // Exclude org id
          },
        },
      ];
  
      if (name) {
        leaveAggregation.push({
          $match: {
            "user.name": {
              $regex: name,
              $options: "i", // Case-insensitive search
            },
          },
        });
      }

      if (org_id) {
        leaveAggregation.push({
          $match: {
            "org._id": new mongoose.Types.ObjectId(org_id),
          },
        });
      }
  
      leaveAggregation.push(
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
      );
  
      const leaves = await Leave.aggregate(leaveAggregation);
  
      const totalLeaves = await Leave.countDocuments(leaveQuery);
      const totalPages = Math.ceil(totalLeaves / limit);
  
    //   const leaves = await Leave.find(leaveQuery)
    //     .populate("user_id", "-password -createdAt -updatedAt -verification_code -is_verified")
    //     .populate("leave_type_id")
    //     .populate("org_id", [], Org)
    //     .sort({ createdAt: -1 })
    //     .skip(skip)
    //     .limit(limit);
  
      return NextResponse.json(
        {
          pagination: {
            totalLeaves,
            totalPages,
            currentPage: page,
            limit,
          },
          leaves,
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("Error fetching leaves:", error);
      return NextResponse.json(
        { error: error.message || "Internal Server Error" },
        { status: 500 }
      );
    }
  }