import { connect_db } from "@/configs/db";
import { LeaveType } from "@/models/leave-type.model";
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

        return NextResponse.json({ msg: "New LeaveType created successfully", data: new_leavtype }, { status: 200 });
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ msg: "Something went wrong" }, { status: 500 });
    }
};


// get all Leave Types
export const GET = async (req: NextRequest) => {
    try {
        const leavetypes = await LeaveType.find();
        return NextResponse.json({ msg: "All LeaveTypes fetched Successfully" , data: leavetypes}, { status: 200 });
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ msg: "Something went wrong" }, { status: 500 });        
    }
}