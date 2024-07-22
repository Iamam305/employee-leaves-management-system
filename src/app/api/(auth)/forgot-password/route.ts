import { ForgotPasswordEmailTemplate } from "@/components/email-temp/ForgotPasswordTemplate";
import { User } from "@/models/user.model";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return NextResponse.json(
        {
          msg: "user not found",
        },
        { status: 401 }
      );
    }
    const data = await resend.emails.send({
      from: "Acme <team@qtee.ai>",
      to: email,
      subject: " Forgot Password",
      react: ForgotPasswordEmailTemplate({ userId: user?._id.toString() }),
      html: "5",
    });
    return NextResponse.json({
      msg: "Email Sent Successfully",
      data,
    });
  } catch (error: any) {
    return NextResponse.json({
      msg: error.message,
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { password, user_id } = await req.json();
    // const user = await User.findById(user_id);

    const user = await User.findOne({
      _id: user_id,
    });

    if (!user) {
      return NextResponse.json({ msg: "Invalid user" }, { status: 400 });
    }

    const pepper_password = password + process.env.PEPPER;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pepper_password, salt);

    await User.updateOne(
      { _id: user_id },
      { $set: { password: hashedPassword } },
      {
        new: true,
      }
    );

    // const user = await User.find

    // user.password = hashedPassword;
    // await user.save();
    return NextResponse.json({
      msg: "Password Changed Successfully",
      user,
      hashedPassword,
      // password
    });
  } catch (error: any) {
    return NextResponse.json({
      msg: error.message,
    });
  }
}
