import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
export const POST = async (req: NextRequest) => {
  try {
    console.log("Received request to verify email");
    const { verification_code, user_id } = await req.json();

    if (!verification_code || !user_id) {
      console.log("Missing required parameters");
      return NextResponse.json(
        { msg: "verification code and user_id are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      _id: new mongoose.Types.ObjectId(user_id),
    });

    if (!user) {
      console.log("User not found");
      return NextResponse.json({ msg: "user not found" }, { status: 400 });
    }

    const is_verified = await bcrypt.compare(
      verification_code,
      user.verification_code
    );
    if (!is_verified) {
      console.log("Invalid verification code");
      return NextResponse.json(
        { msg: "invalid verification code" },
        { status: 400 }
      );
    }
    const updated_user = await User.updateOne(
      { _id: user._id },
      { $set: { is_verified: true } }
    );

    console.log("User verified successfully");
    return NextResponse.json({ msg: "user verified" }, { status: 200 });
  } catch (error) {
    if (error instanceof TypeError) {
      console.log("Invalid request body");
      return NextResponse.json(
        { msg: "invalid request body" },
        { status: 400 }
      );
    } else {
      console.error(error);
      return NextResponse.json(JSON.stringify(error), { status: 500 });
    }
  }
};
