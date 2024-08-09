import { connect_db } from "@/configs/db";
import { Membership } from "@/models/membership.model";
import { NextRequest, NextResponse } from "next/server";

connect_db();

export async function GET(req: NextRequest) {
  try {
    const membership = await Membership.find().populate(
      "user_id",
      "-password -createdAt -updatedAt -verification_code -is_verified"
    );
    return NextResponse.json(
      {
        membership,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        msg: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
