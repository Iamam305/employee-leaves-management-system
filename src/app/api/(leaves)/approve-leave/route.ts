import { EmailVerification } from "@/components/email-temp/EmailVerificationTemplate";
import { LeaveRequestEmail } from "@/components/email-temp/LeaveRequestTemplate";
import { LeaveStatusEmail } from "@/components/email-temp/LeaveStatusTemplate";
import { connect_db } from "@/configs/db";
import { auth_middleware } from "@/lib/auth-middleware";
import { updateLeaveBalance } from "@/lib/balanceservices";
import { getDays, getMonth, getYear } from "@/lib/utils";
import { LeaveType } from "@/models/leave-type.model";
import { Leave } from "@/models/leave.model";
import { User } from "@/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

connect_db();


export const POST = async (req : NextRequest) => {
    try {

        // Extract data from the request body
        const { leave_id  , statusupdate , org_id} = await req.json();

        const auth :any = await auth_middleware(req , org_id);

        // verfiy user is manager , hr , admin
        console.log('auth' , auth[0].membership)
        if(auth[0] === null || auth[0]?.membership?.role === "employee"){
            return NextResponse.json({msg: 'unauthorized you dont have rights to approve leave'} , {status : 401})
        }

        // Validate required fields
        if (!leave_id) {
            return NextResponse.json({ msg: "Leave id required " }, { status: 400 });
        }

        // approve leave
        const updateleave: any = await Leave.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(leave_id as string) },
            {
                status: statusupdate
            },
            { new: true , upsert:true}
        )
        .populate("user_id")
        .populate("leave_type_id")
        .exec();

        let updateuserbalance = {};

        if(statusupdate === 'approved'){
            const year = getYear(updateleave.end_date);
            const month = getMonth(updateleave.end_date);
            updateuserbalance = await updateLeaveBalance(updateleave.user_id , year , updateleave.leave_type_id.name , month)   
        }

        console.log('updateleave' , updateleave)
        console.log('updatedbalance' , updateuserbalance)



        const employee = await User.findById(updateleave.user_id);


        // send message to employee for status changed
        const { data, error } = await resend.emails.send({
            from: "Acme <team@qtee.ai>",
            to: `${updateleave.user_id.email}`,
            subject: "Leave Status changed",
            react: LeaveStatusEmail({
                employeeName : `${updateleave.user_id.name}`,
                leaveStartDate : `${updateleave.start_date}`,
                leaveEndDate : `${updateleave.end_date}`,
                leaveReason :  `${updateleave.leave_type_id.name}`,
                StatusOfLeave:`${updateleave.status}`,
            }),
            html: "5",
          });

        //if not manager than send to hr or admin


        // Respond with the created leave request
        return NextResponse.json({ msg: "Leave request updated successfully", updateleave , updateuserbalance}, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ msg: "Something went wrong" , data:error}, { status: 500 });
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