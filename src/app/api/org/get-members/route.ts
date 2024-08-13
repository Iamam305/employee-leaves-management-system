import { connect_db } from "@/configs/db";
import { auth_middleware } from "@/lib/auth-middleware";
import { Membership } from "@/models/membership.model";
import { Org } from "@/models/org.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connect_db();

export async function GET(req: NextRequest) {
  try {
    const auth: any = await auth_middleware(req);
    if (auth[0] === null || auth[1] !== null) {
      console.error("Authentication error:", auth[1]);
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }
    const auth_data = auth[0];
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const limit = 10;
    const skip = (page - 1) * limit;

    if (auth_data.membership.role === "admin") {
      const name = req.nextUrl.searchParams.get("name");
      const org_id = req.nextUrl.searchParams.get("org_id");

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
    } else {
      const org = await Org.find({
        _id: auth_data.membership.org_id,
      });
      const membership = await Membership.find({
        org_id: auth_data.membership.org_id,
        user_id: { $ne: null },
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user_id")
        .populate("org_id");

      const totalUsers = await Membership.countDocuments({
        org_id: auth_data.membership.org_id,
        user_id: { $ne: null },
      });

      const totalPages = Math.ceil(totalUsers / limit);

      return NextResponse.json({
        msg: "Employee",
        pagination: {
          totalUsers,
          totalPages,
          currentPage: page,
          limit,
        },
        membership,
      });
    }
  } catch (error: any) {
    console.error("Error fetching users and memberships:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
