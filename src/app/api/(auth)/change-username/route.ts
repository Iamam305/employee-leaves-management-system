import UsernameChangedTemplate from "@/components/email-temp/UsernameChangedTempeate";
import { connect_db } from "@/configs/db";
import { auth_middleware } from "@/lib/auth-middleware";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
connect_db();

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    const auth: any = await auth_middleware(req);
    if (auth[0] === null || auth[1] !== null) {
      console.error("Authentication error:", auth[1]);
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }
    const auth_data = auth[0];
    const logged_in_user = await User.findById(auth_data?.user._id);
    logged_in_user.name = name;
    await logged_in_user.save();

    const data = await resend.emails.send({
      from: "Ritik <team@qtee.ai>",
      to: logged_in_user.email,
      subject: "Username Has Been Changed Successfully",
      react: UsernameChangedTemplate(),
      html: "5",
    });
    return NextResponse.json({
      msg: "Username Changed Successfully",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        msg: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
