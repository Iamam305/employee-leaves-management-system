import { connect_db } from "@/configs/db";
import { auth_middleware } from "@/lib/auth-middleware";
import { calculateTotalCredit, initializeEmployeeBalance, updateEmployeeBalance } from "@/lib/balanceservices";
import { Balances } from "@/models/balanceCredits.model";
import { User } from "@/models/user.model";
import dayjs from "dayjs";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

connect_db();

export const POST  = async (req:NextRequest) => {
    try {
        const auth:any = await auth_middleware(req);

        console.log("authenticate" , auth)

        if(auth[0] === null || auth[0]?.membership?.role === ("employee" || "manager")){
            return NextResponse.json({msg: 'unauthorized you dont have rights to Add Credits or update Credits'} , {status : 401})
        }

        const { credits , employeeId } = await req.json();
        const year = dayjs().year();
        const updatedBalance = await updateEmployeeBalance(employeeId , year, credits)



        return NextResponse.json({msg:"routing working" , updatedBalance} , {status: 200})

        
    } catch (error) {
        console.log('error occured' , error)
        return NextResponse.json({ msg: "Internal Error Occured" }, { status: 500 })
    }
    // console.log('api working')
    // const year = dayjs().year();
    // const newuser = '669f97ab186ea1a384360672'
    // const credits = {
    //     'healthcare':1,
    //     'Medical Leave':2,
    //     'new leave test':3,
    // }
    // const new_balance = await updateEmployeeBalance(newuser , year , credits )
}


export const GET = async(req:NextRequest) => {
    try{
        const year = dayjs().year();
        const userId = "6694dc4d1d2cd7102ba5972c";
        const totalbalancecredit = await calculateTotalCredit(userId , year);
        return NextResponse.json({msg:"total credit fetched succesfully ", totalbalancecredit},{status:200})

    }
    catch(error) {
        console.log('error occured' , error)
        return NextResponse.json({msg:"error occured" , error}, {status:500})
    }
    // try {
    //     const year = new Date().getFullYear();

    //     // Find all employees who are not admins
    //     const employees = await User.find({ role: { $ne: "admin" } });

    //     // Initialize balance for those who don't have one yet
    //     for (const employee of employees) {
    //         const balanceExists = await Balances.findOne({ userId: employee._id, year });

    //         if (!balanceExists) {
    //             await initializeEmployeeBalance(employee._id, year);
    //         }
    //     }

    //     return NextResponse.json({ msg: "Balances initialized for all employees without existing balance" },{status:200});
    // } catch (error) {
    //     console.error("Error initializing balances:", error);
    //     return NextResponse.json({ msg: "Something went wrong while initializing balances" },{status:500});
    // }
}