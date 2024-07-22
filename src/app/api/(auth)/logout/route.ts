import { connect_db } from "@/configs/db";
import { NextRequest, NextResponse } from "next/server";

connect_db();

export async function GET(req: NextRequest) {
  try {
    const res = NextResponse.json({
      msg: "Logged Out Successfully",
    });
    res.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return res;
  } catch (error) {
    return NextResponse.json(
      {
        msg: "Something Went Wrong",
      },
      { status: 400 }
    );
  }
}
