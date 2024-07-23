import { connect_db } from "@/configs/db";
import { LeaveType } from "@/models/leave-type.model";
import { Leave } from "@/models/leave.model";
import { NextRequest, NextResponse } from "next/server";

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

        // Respond with the created leave request
        return NextResponse.json({ msg: "Leave request created successfully", data: newLeave }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ msg: "Something went wrong" }, { status: 500 });
    }
};



export const GET = async (req: NextRequest) => {
    try {
        const leaves = await Leave.find();
        return NextResponse.json({ msg: "All Leaves fetched Successfully" , data: leaves}, { status: 200 });
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ msg: "Something went wrong" }, { status: 500 });        
    }
}