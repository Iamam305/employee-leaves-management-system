import { connect_db } from "@/configs/db";
import { addNewLeaveTypeToAllEmployees } from "@/lib/balanceservices";
import { LeaveType } from "@/models/leave-type.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

connect_db();

//create Leave Type
export const POST = async (req: NextRequest) => {
    try {
        const { role, org_id, Leave_Type_Name, Leave_Type_Description, carryforward, count } = await req.json();
        
        // Correct the condition to check if the role is neither 'admin' nor 'hr'
        if (role !== 'admin' && role !== 'hr') {
            return NextResponse.json({ msg: "Only Admin or Hr can create LeaveType" }, { status: 403 });
        }

        // Check if LeaveType already exists
        const existingLeaveType = await LeaveType.findOne({ name: Leave_Type_Name, org_id: org_id });
        if (existingLeaveType) {
            return NextResponse.json({ msg: "LeaveType already exists" }, { status: 409 });
        }

        const new_leavtype = await new LeaveType({
            name: Leave_Type_Name,
            description: Leave_Type_Description,
            org_id: org_id,
            does_carry_forward: carryforward,
            count_per_month: count,
        }).save();

        // adding new leave type to balance
        await addNewLeaveTypeToAllEmployees(new_leavtype);

        return NextResponse.json({ msg: "New LeaveType created successfully", data: new_leavtype }, { status: 200 });
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ msg: "Something went wrong" }, { status: 500 });
    }
};


// get all Leave Types
// export const GET = async (req: NextRequest) => {
//     try {
//         const leavetypes = await LeaveType.find().populate('org_id');
//         return NextResponse.json({ msg: "All LeaveTypes fetched Successfully" , data: leavetypes}, { status: 200 });
        
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({ msg: "Something went wrong" }, { status: 500 });        
//     }
// }

export const GET = async (req: NextRequest) => {
    try {
        // Extract query parameters
        
        const org_id = req.nextUrl.searchParams.get("org_id");
        const name = req.nextUrl.searchParams.get("name");
        const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
        const limit = 10; // Items per page
        const skip = (page - 1) * limit;

        // Build the query for leave types
        let leaveTypeQuery: any = {};

        if (org_id) {
            leaveTypeQuery.org_id = new mongoose.Types.ObjectId(org_id);
        }

        if (name) {
            leaveTypeQuery.name = {
                $regex: name,
                $options: "i" // Case-insensitive search
            };
        }

        // Aggregate leave types with org details
        let leaveTypeAggregation: any[] = [
            { $match: leaveTypeQuery },
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
                    "org_id": 0, // Exclude org id
                },
            },
            { $sort: { createdAt: -1 } }, // Sort by created date (if applicable)
            { $skip: skip },
            { $limit: limit }
        ];

        // Execute aggregation query with pagination
        const leavetypes = await LeaveType.aggregate(leaveTypeAggregation);

        // Calculate total documents for pagination
        const totalLeaveTypes = await LeaveType.countDocuments(leaveTypeQuery);
        const totalPages = Math.ceil(totalLeaveTypes / limit);

        return NextResponse.json(
            {
                pagination: {
                    totalLeaveTypes,
                    totalPages,
                    currentPage: page,
                    limit,
                },
                data: leavetypes,
                msg: "All LeaveTypes fetched Successfully",
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching leave types:", error);
        return NextResponse.json({ msg: "Something went wrong", error: error.message || "Internal Server Error" }, { status: 500 });
    }
}