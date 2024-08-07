import { connect_db } from "@/configs/db";
import { LeaveType } from "@/models/leave-type.model";
import { NextRequest, NextResponse } from "next/server";

connect_db();

//get Single Leave Type
export const GET = async (req: NextRequest , { params }:any) => {
    try {
        const { id } = params;
        const leavtype = await LeaveType.findById(id);
        return NextResponse.json({ msg: "LeaveType fetched Successfully" , data: leavtype}, { status: 200 });
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ msg: "Something went wrong" }, { status: 500 });        
    }
}