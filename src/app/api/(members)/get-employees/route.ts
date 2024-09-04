import { connect_db } from "@/configs/db";
import { Membership } from "@/models/membership.model";
import { NextRequest, NextResponse } from "next/server";

connect_db();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const org_id = searchParams.get("org_id");
    if (!org_id) {
      return NextResponse.json({ msg: "org_id is required" }, { status: 400 });
    }
    const membership_user_val = await Membership.find({
      org_id,
      role: "employee",
      manager_id: { $exists: false },
    }).populate("user_id");
    const membership_manager_val = await Membership.find({
      org_id,
      role: "manager",
    }).populate("user_id");
    const employees =
      membership_user_val.length > 0
        ? membership_user_val.map((member) => member.user_id)
        : [];
    const managers = membership_manager_val.map((member) => member.user_id);
    return NextResponse.json({
      employees,
      managers,
    });
  } catch (error) {
    return NextResponse.json({ msg: "Failed to fetch data" }, { status: 500 });
  }
}
