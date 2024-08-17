import { connect_db } from "@/configs/db";
import { LeaveType } from "@/models/leave-type.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

connect_db();

//get Single Leave Type
export const GET = async (req: NextRequest , { params }:any) => {
    try {
        const { id } = params;
        const leavtype = await LeaveType.findById(id);
        return NextResponse.json({ msg: "LeaveType fetched Successfully" , data: leavtype}, { status: 200 });
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ msg: "Something went wrong" }, { status: 500 });        
    }
}


//update single Leave Type 
export const POST = async (req: NextRequest , {params}:any) => {
    try {
        const { id } = params;  // Retrieve leave_id from request params
        const { role, org_id, Leave_Type_Name, Leave_Type_Description, carryforward, count } = await req.json();

        // Check if the role is authorized to update the leave type
        if (role !== 'admin' && role !== 'hr') {
            return NextResponse.json({ msg: "Only Admin or Hr can update LeaveType" }, { status: 403 });
        }

        // Find the existing LeaveType by leave_id and org_id
        // Update the LeaveType document using findOneAndUpdate
        const updatedLeaveType = await LeaveType.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(id as string)},  // Find the document by leave_id
            {
                $set: {
                    name: Leave_Type_Name,
                    description: Leave_Type_Description,
                    does_carry_forward: carryforward,
                    count_per_month: count
                }
            },
            { new: true , upsert:true}  // Return the updated document
        ).exec();

        // Check if the LeaveType was found and updated
        if (!updatedLeaveType) {
            return NextResponse.json({ msg: "LeaveType not found" }, { status: 404 });
        }

        return NextResponse.json({ msg: "LeaveType updated successfully", data: updatedLeaveType }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ msg: "Something went wrong" }, { status: 500 });
    }
};