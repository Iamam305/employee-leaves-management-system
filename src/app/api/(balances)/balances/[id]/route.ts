import { calculateTotalCredit } from "@/lib/balanceservices";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest , { params } :any) => {
    try{
        const { id } = params
        const year = dayjs().year();
        const totalbalance = await calculateTotalCredit(id , year);
        return NextResponse.json({msg:"total credit fetched succesfully ", totalbalance},{status:200})

    }
    catch(error) {
        console.log('error occured' , error)
        return NextResponse.json({msg:"error occured" , error}, {status:500})
    }
}