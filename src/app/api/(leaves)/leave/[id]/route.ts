import { connect_db } from "@/configs/db";
import { Leave } from "@/models/leave.model";
import { NextRequest, NextResponse } from "next/server";

connect_db();

// get single leave
export const GET = async (req: NextRequest , { params } :any) => {
    try {
        const { id } = params;
        const leave = await Leave.findById(id);
        return NextResponse.json({ msg: "Leave fetched Successfully" , data: leave}, { status: 200 });
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ msg: "Something went wrong" }, { status: 500 });        
    }
}