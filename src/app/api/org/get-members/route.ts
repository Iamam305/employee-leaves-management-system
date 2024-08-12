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
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const limit = 10;
    const skip = (page - 1) * limit;
    let userQuery = {};
    if (name) {
      userQuery = { ...userQuery, name: { $regex: name, $options: "i" } };
    }
    let membershipQuery = {};
    if (org_id) {
      membershipQuery = { org_id };
    }
    let userIds = [];
    if (org_id) {
      const memberships = await Membership.find(membershipQuery).distinct(
        "user_id"
      );
      userIds = memberships;
      userQuery = { ...userQuery, _id: { $in: userIds } };
    }
    const totalUsers = await User.countDocuments(userQuery);
    const totalPages = Math.ceil(totalUsers / limit);
    let users = await User.find(userQuery as any)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const all_members = await Promise.all(
      users.map(async (user) => {
        const memberships = await Membership.find({
          user_id: user._id,
          ...membershipQuery,
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
        pagination: {
          totalUsers,
          totalPages,
          currentPage: page,
          limit,
        },
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
