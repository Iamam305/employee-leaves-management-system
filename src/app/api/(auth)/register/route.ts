import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { User } from "@/models/user.model";
import { Org } from "@/models/org.model";
import { Membership } from "@/models/membership.model";
import { Resend } from "resend";
import { connect_db } from "@/configs/db";
connect_db();
const resend = new Resend(process.env.RESEND_API_KEY);
export const POST = async (req: NextRequest) => {
  try {
    const { email, password, org_name, user_name } = await req.json();
    if (!email || !password || !org_name) {
      return NextResponse.json(
        JSON.stringify({ error: "Email, password, and org_name are required" }),
        { status: 400 }
      );
    }
    const exsisting_user = await User.findOne({ email });
    if (exsisting_user) {
      return NextResponse.json({ msg: "user already exists" }, { status: 400 });
    }
    const salt = await bcrypt.genSalt(10);

    // Combine password with pepper
    const pepper_password = password + process.env.PEPPER;

    // Hash the peppered password
    const hashed_password = await bcrypt.hash(pepper_password, salt);

    const verification_code = crypto.randomBytes(64).toString("hex");
    const hashed_verification_code = await bcrypt.hash(verification_code, salt);

    const new_user = new User({
      verification_code: hashed_verification_code,
      email,
      password: hashed_password,
      name: user_name,
    });

    const new_org = new Org({
      name: org_name,
    });

    const new_membership = new Membership({
      user_id: new_user._id,
      org_id: new_org._id,
      role: "admin",
    });

    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verification Code",
      text: verification_code + "+" + new_user._id,
    });

    if (error) {
      throw new Error(error.message);
    }
    await Promise.all([new_user.save(), new_org.save(), new_membership.save()]);

    return NextResponse.json(
      { msg: "registration successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(JSON.stringify(error), { status: 500 });
  }
};
