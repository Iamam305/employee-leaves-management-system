import { auth_middleware } from "@/lib/auth-middleware";
import { Membership } from "@/models/membership.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { uid } from "uid";
import bcrypt from "bcrypt";
import { Resend } from "resend";
import { InviteEmailTemplate } from "@/components/email-temp/InviteMembersTemplate";
import { connect_db } from "@/configs/db";

const resend = new Resend(process.env.RESEND_API_KEY);

connect_db();
export const POST = async (req: NextRequest) => {
  try {
    const { emails, org_id, role } = await req.json();
    const auth: any = await auth_middleware(req);

    console.log("Auth 1 ===> ", auth[0]);
    console.log("Auth 2===> ", auth[1]);

    if (auth[0] === null || auth[1] !== null) {
      console.error("Authentication error:", auth[1]);
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }
    const authData = auth[0];
    if (authData?.membership?.role !== "admin") {
      return NextResponse.json(
        { msg: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }
    if (!emails || !Array.isArray(emails) || emails.length === 0 || !role) {
      return NextResponse.json(
        { error: "emails and role are required" },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      emails.map(async (email) => {
        try {
          let user = await User.findOne({ email });

          if (user) {
            return null;
          }

          const password = uid(12);
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(
            password + process.env.PEPPER!,
            salt
          );

          user = await User.create({
            name: email.split("@")[0],
            email,
            password: hashedPassword,
            is_verified:true
          });

          const new_membership = await Membership.create({
            user_id: user._id,
            org_id: new mongoose.Types.ObjectId(org_id),
            role,
          });

          const emailData = await resend.emails.send({
            from: `Ritik <team@qtee.ai>`,
            to: [email],
            subject: "Invitation",
            react: InviteEmailTemplate({ email, password }),
            html: "5",
          });

          return {
            msg: "Invitation Sent Successfully",
          };
        } catch (error: any) {
          console.error(`Error processing invitation for ${email}:`, error);
          return NextResponse.json(
            {
              msg: "User Already Exits",
            },
            { status: 400 }
          );
        }
      })
    );

    if (results[0] === null) {
      return NextResponse.json(
        {
          msg: "User Already Exits",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        msg: "Invitation Sent Successfully",
        results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
