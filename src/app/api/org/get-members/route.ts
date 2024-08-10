import { connect_db } from "@/configs/db";
import { Membership } from "@/models/membership.model";
import { Org } from "@/models/org.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connect_db();

export async function GET(req: NextRequest) {
  try {
    const name = req.nextUrl.searchParams.get("name");
    const org_id = req.nextUrl.searchParams.get("org_id");
    let query = {};
    if (name) {
      query = { ...query, name: { $regex: name, $options: 'i' } };
    }
    let users = await User.find(query);
    let membershipQuery = {};
    if (org_id) {
      membershipQuery = { org_id };
    }
    const all_members = await Promise.all(
      users.map(async (user) => {
        const memberships = await Membership.find({
          user_id: user._id,
          ...membershipQuery
        })
          .populate("org_id", [], Org)
          .populate(
            "user_id",
            "-password -createdAt -updatedAt -verification_code -is_verified"
          );
        return memberships;
      })
    );
    const flattened_members = all_members.flat();
    return NextResponse.json(
      {
        name,
        org_id,
        all_members: flattened_members,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching users and memberships:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}