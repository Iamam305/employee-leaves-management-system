import { connect_db } from "@/configs/db";
import { Membership } from "@/models/membership.model";
import { NextRequest, NextResponse } from "next/server";

connect_db();
export async function GET(req: NextRequest) {
  try {
    const employees = await Membership.find({ role: "employee" });
    return NextResponse.json({
      employees,
    });
  } catch (error) {}
}
