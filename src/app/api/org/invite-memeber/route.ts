import { Membership } from "@/models/membership.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { email, org_id, user_id, role } = await req.json();
    if (!email || !org_id) {
      return NextResponse.json(
        JSON.stringify({ error: "email and org_id are required" }),
        { status: 400 }
      );
    }
    const inviter_memebership = await Membership.findOne({
      user_id: user_id,
      org_id: org_id,
      role: "admin",
    });
    if (!inviter_memebership) {
      return NextResponse.json({
        msg: "You must be an admin to invite members",
      });
    }
    const exsisting_user = await User.findOne({ email: email });

    if (exsisting_user) {
    }
    const new_user = await Membership.create({
      email,
      org_id,
      role,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(JSON.stringify(error), { status: 500 });
  }
};
