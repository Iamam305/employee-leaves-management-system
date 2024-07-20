import { auth_middleware } from "@/lib/auth-middleware";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ msg: "No token provided" }, { status: 401 });
    }
    const user = await auth_middleware({ token });
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
