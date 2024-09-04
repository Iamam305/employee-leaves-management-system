import { connect_db } from "@/configs/db";
import { startCronJob } from "@/lib/cron";
import { NextRequest, NextResponse } from "next/server";

connect_db();

export const GET = async(req:NextRequest) => {
    try{
        const reminder = await startCronJob();
        return NextResponse.json({msg:"route working successfully" , reminder},{status:200})
    }
    catch(error)
    {
        console.log('error occured' , error)
        return NextResponse.json({msg:'fetch request failed'} , {status:500})
    }
}