import mongoose from "mongoose";
import { Resend } from "resend";
import { LeaveStatusEmail } from "@/components/email-temp/LeaveStatusTemplate";
import { Leave } from "@/models/leave.model";
import dayjs from "dayjs";
var cron = require('node-cron');

const resend = new Resend(process.env.RESEND_API_KEY);

let cronJobStarted = false;

export function startCronJob() {
    if (cronJobStarted) {
        return; // Prevent multiple cron jobs from being scheduled
    }

    cronJobStarted = true; // Mark the cron job as started

    cron.schedule('0 11 * * 1-6', async () => {
        try {
            if (!mongoose.connection.readyState) {
                console.log('Mongoose is not connected. Skipping job.');
                return;
            }

            const leaves = await Leave.aggregate([
                { $match: { status: 'pending' } },
                {
                    $lookup: {
                        from: 'users', // The collection name for User model
                        localField: 'manager_id',
                        foreignField: '_id',
                        as: 'manager'
                    }
                },
                {
                    $unwind: '$manager'
                },
                {
                    $lookup: {
                        from: 'leavetypes', // The collection name for LeaveType model
                        localField: 'leave_type_id',
                        foreignField: '_id',
                        as: 'leave_type'
                    }
                },
                {
                    $unwind: '$leave_type'
                },
                {
                    $project: {
                        _id: 1,
                        status: 1,
                        'manager.name': 1,
                        'manager.email': 1,
                        start_date: 1,
                        end_date: 1,
                        'leave_type.name': 1
                    }
                }
            ]);

            if (leaves.length > 0) {
                for (const leave of leaves) {
                    // Convert dates to strings
                    const formattedStartDate = dayjs(leave.start_date).date().toString();
                    const formattedEndDate = dayjs(leave.end_date).date().toString();
                    console.log('pending leave' , leave)
                    const { data, error } = await resend.emails.send({
                        from: "Acme <team@qtee.ai>",
                        to: `${leave.manager.email}`,
                        subject: "Leave Status Changed",
                        react: LeaveStatusEmail({
                            employeeName: leave.manager.name,
                            leaveStartDate: formattedStartDate,
                            leaveEndDate: formattedEndDate,
                            leaveReason: leave.leave_type.name,
                            StatusOfLeave: leave.status,
                        }),
                        html: "5" // Replace this with actual HTML content if needed
                    });

                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        console.log('Email sent successfully:', data);
                    }
                }
            } else {
                console.log('No pending leaves.');
            }
        } catch (error) {
            console.log('Error occurred:', error);
        }
    });
}



// export const startCronJob = cron.schedule(
//     '*/10 * * * *' ,
//     async() => {
//        try{
//            let arr = [];
//            const pending = await Leave.find({status:'pending'}).populate('manager_id' , 'name email');
//            for(const leave of pending) {
//                if(leave.manager_id){
//                    arr.push(leave)
//                    console.log('leavedetails' , leave);
//                }
//            }
//            if(arr.length > 0){
//                return arr;
//            }
//            else{
//                return 0;
//            }
//        }
//        catch(error : any) {
//            console.log('error occured' , error)
//            return 'error';
//        }
//    }

// ) 
