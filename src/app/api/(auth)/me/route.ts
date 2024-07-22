import { auth_middleware } from "@/lib/auth-middleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await auth_middleware(req);
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }
    return NextResponse.json(user);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      msg: error.message,
    });
  }
}
