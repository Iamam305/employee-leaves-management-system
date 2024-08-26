import { connect_db } from "@/configs/db";
import { auth_middleware } from "@/lib/auth-middleware";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

connect_db();

export async function POST(req: NextRequest) {
  try {
    const { oldPassword, newPassword } = await req.json();
    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        {
          msg: "Please fill out all the fields",
        },
        { status: 400 }
      );
    }
    const auth: any = await auth_middleware(req);
    const auth_data = auth[0]?.user;
    const current_user = await User.findById(auth_data._id);
    if (!current_user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }
    const is_old_password_valid = await bcrypt.compare(
      oldPassword + process.env.PEPPER,
      current_user.password
    );
    if (!is_old_password_valid) {
      return NextResponse.json(
        { msg: "Invalid old password" },
        { status: 400 }
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(
      newPassword + process.env.PEPPER,
      salt
    );
    current_user.password = hashedNewPassword;
    await current_user.save();
    return NextResponse.json(
      { msg: "Password updated successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
