import { connect_db } from "@/configs/db";
import { auth_middleware } from "@/lib/auth-middleware";
import { calculateTotalCredit, initializeEmployeeBalance, updateEmployeeBalance } from "@/lib/balanceservices";
import { Balances } from "@/models/balanceCredits.model";
import { User } from "@/models/user.model";
import dayjs from "dayjs";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

connect_db();

// export const POST  = async (req:NextRequest) => {
//     try {
//         const auth:any = await auth_middleware(req);

//         console.log("authenticate" , auth)

//         if(auth[0] === null || auth[0]?.membership?.role === ("employee" || "manager")){
//             return NextResponse.json({msg: 'unauthorized you dont have rights to Add Credits or update Credits'} , {status : 401})
//         }

//         const { credits , employeeId } = await req.json();
//         const year = dayjs().year();
//         const updatedBalance = await updateEmployeeBalance(employeeId , year, credits)



//         return NextResponse.json({msg:"routing working" , updatedBalance} , {status: 200})

        
//     } catch (error) {
//         console.log('error occured' , error)
//         return NextResponse.json({ msg: "Internal Error Occured" }, { status: 500 })
//     }
//     // console.log('api working')
//     // const year = dayjs().year();
//     // const newuser = '669f97ab186ea1a384360672'
//     // const credits = {
//     //     'healthcare':1,
//     //     'Medical Leave':2,
//     //     'new leave test':3,
//     // }
//     // const new_balance = await updateEmployeeBalance(newuser , year , credits )
// }


export const GET = async(req:NextRequest) => {
    try{
        const balances = await Balances.find();
        return NextResponse.json({msg:"All Balances fetched SuccessFully", balances},{status:200})
    }
    catch(error) {
        console.log('error occured' , error)
        return NextResponse.json({msg:"error occured" , error}, {status:500})
    }
}

// export const GET = async(req:NextRequest) => {
//     try{
//         const org = "66cd85f17e350e405edeb614"
//         const userid = "66cd89017e350e405edeb873"
//         const year = '2024'
//         const balances = await initializeEmployeeBalance(userid , year , org);
//         return NextResponse.json({msg:"All Balances fetched SuccessFully", balances},{status:200})
//     }
//     catch(error) {
//         console.log('error occured' , error)
//         return NextResponse.json({msg:"error occured" , error}, {status:500})
//     }
// }