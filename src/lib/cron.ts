import { Leave } from "@/models/leave.model";

// src/lib/cron.js
var cron = require('node-cron')

// export function startCronJob() {
    // Schedule: Every day from Monday to Saturday at 11 AM
    // cron.schedule('0 11 * * 1-6', async () => {
    //     try {
    //         let arr = [];
    //         const pendingLeaves:any = await Leave.find({status : 'pending'}).populate("manager_id", "name email");

    //         for (const leave of pendingLeaves) {
    //             const managerEmail = await leave.manager_id.email;
    //             if (managerEmail) {
    //                 // await sendEmail(manager.email, 'Pending Leave Approvals', `You have pending leave requests to approve.`);
    //                 console.log('leaveDetails' , leave)
    //                 arr.push(leave)
    //             }
    //         }

    //         console.log('Reminder emails sent successfully');
    //         return arr;
    //     } catch (error:any) {
    //         console.error('Failed to send reminder emails:', error.message);
    //     }
    // });
// }

export const startCronJob = async() => {
    try{
        let arr = [];
        const pending = await Leave.find({status:'pending'});
        for(const leave of pending) {
            if(leave.manager_id){
                arr.push(leave)
                console.log('leavedetails' , leave);
            }
        }
        if(arr.length > 0){
            return arr;
        }
        else{
            return 0;
        }
    }
    catch(error : any) {
        console.log('error occured' , error)
        return 'error';
    }
}
