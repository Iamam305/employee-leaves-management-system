import { connect_db } from "@/configs/db";
import { updateLeaveTypeForAllEmployees } from "@/lib/balanceservices";
import { LeaveType } from "@/models/leave-type.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

connect_db();

//get Single Leave Type
export const GET = async (req: NextRequest, { params }: any) => {
    try {
        const { id } = params;
        const leavtype = await LeaveType.findById(id);
        return NextResponse.json({ msg: "LeaveType fetched Successfully", data: leavtype }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ msg: "Something went wrong" }, { status: 500 });
    }
}


//old update single Leave Type 
// export const POST = async (req: NextRequest , {params}:any) => {
//     try {
//         const { id } = params;  // Retrieve leave_id from request params
//         const { role, org_id, Leave_Type_Name, Leave_Type_Description, carryforward, count } = await req.json();

//         // Check if the role is authorized to update the leave type
//         if (role !== 'admin' && role !== 'hr') {
//             return NextResponse.json({ msg: "Only Admin or Hr can update LeaveType" }, { status: 403 });
//         }

//         // Find the existing LeaveType by leave_id and org_id
//         // Update the LeaveType document using findOneAndUpdate
//         const updatedLeaveType = await LeaveType.findOneAndUpdate(
//             { _id: new mongoose.Types.ObjectId(id as string)},  // Find the document by leave_id
//             {
//                 $set: {
//                     name: Leave_Type_Name,
//                     description: Leave_Type_Description,
//                     does_carry_forward: carryforward,
//                     count_per_month: count
//                 }
//             },
//             { new: true , upsert:true}  // Return the updated document
//         ).exec();

//         // Check if the LeaveType was found and updated
//         if (!updatedLeaveType) {
//             return NextResponse.json({ msg: "LeaveType not found" }, { status: 404 });
//         }

//         return NextResponse.json({ msg: "LeaveType updated successfully", data: updatedLeaveType }, { status: 200 });

//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({ msg: "Something went wrong" }, { status: 500 });
//     }
// };

// new post route for update leavetype
export const POST = async (req: NextRequest, { params }: any) => {
    try {
        const { id } = params; // Retrieve leave_id from request params
        const {
            role,
            org_id,
            Leave_Type_Name,
            Leave_Type_Description,
            carryforward,
            count
        } = await req.json();

        // Check if the role is authorized to update the leave type
        if (role !== "admin" && role !== "hr") {
            return NextResponse.json(
                { msg: "Only Admin or HR can update LeaveType" },
                { status: 403 }
            );
        }

        // Find the existing LeaveType by leave_id
        const existingLeaveType = await LeaveType.findOne({
            _id: new mongoose.Types.ObjectId(id as string),
        }).exec();

        if (!existingLeaveType) {
            return NextResponse.json({ msg: "LeaveType not found" }, { status: 404 });
        }

        // Store the old name before updating
        const oldName = existingLeaveType.name;

        // Check if the leave type name or count per month has changed
        const nameChanged = oldName !== Leave_Type_Name;
        const countChanged = existingLeaveType.count_per_month !== count;

        // Update the existing LeaveType document directly
        existingLeaveType.name = Leave_Type_Name;
        existingLeaveType.description = Leave_Type_Description;
        existingLeaveType.does_carry_forward = carryforward;
        existingLeaveType.count_per_month = count;

        const updatedLeaveType = await existingLeaveType.save();

        // If the name or count per month has changed, update it for all employees
        if (nameChanged || countChanged) {
            await updateLeaveTypeForAllEmployees(
                org_id,
                new Date().getFullYear(), // Assuming you want to update the balance for the current year
                oldName, // Old leave type name (before update)
                Leave_Type_Name, // New leave type name (after update)
                count // New credit per month
            );
        }

        return NextResponse.json(
            { msg: "LeaveType updated successfully", data: updatedLeaveType },
            { status: 200 }
        );
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { msg: "Something went wrong", error: error.msg },
            { status: 500 }
        );
    }
};
