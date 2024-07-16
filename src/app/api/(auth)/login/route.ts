import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { msg: "email and password are required" },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ msg: "user not found" }, { status: 400 });
    }

    const is_verified = await bcrypt.compare(
      password + process.env.PEPPER!,
      user.password
    );
    if (!is_verified) {
      return NextResponse.json({ msg: "invalid password" }, { status: 400 });
    }

    const token = jwt.sign(
      { user_email: user.email, user_id: user._id },
      process.env.JWT_SECRET!,
      {
        expiresIn: "72h",
      }
    );

    const response = NextResponse.json(
      { msg: "login successful", token },
      { status: 200 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 3,
    });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(JSON.stringify(error), { status: 500 });
  }
};
