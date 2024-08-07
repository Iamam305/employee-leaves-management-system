import { EmailVerification } from "@/components/email-temp/EmailVerificationTemplate";
import { LeaveRequestEmail } from "@/components/email-temp/LeaveRequestTemplate";
import { connect_db } from "@/configs/db";
import { LeaveType } from "@/models/leave-type.model";
import { Leave } from "@/models/leave.model";
import { User } from "@/models/user.model";
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



export const GET = async (req: NextRequest) => {
    try {
        const leaves = await Leave.find();
        return NextResponse.json({ msg: "All Leaves fetched Successfully" , data: leaves}, { status: 200 });
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ msg: "Something went wrong" }, { status: 500 });        
    }
}