import { connect_db } from "@/configs/db";
import { auth_middleware } from "@/lib/auth-middleware";
import { Membership } from "@/models/membership.model";
import { Org } from "@/models/org.model";
import { User } from "@/models/user.model";
import { all } from "axios";
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
    const name = req.nextUrl.searchParams.get("name");
    let userQuery = {};
    if (name) {
      userQuery = { ...userQuery, name: { $regex: name, $options: "i" } };
    }
    if (auth_data.membership.role === "admin") {
      const org_id = req.nextUrl.searchParams.get("org_id");
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
    } else if (auth_data.membership.role === "hr") {
      // Non-admin
      let membershipQuery: any = {
        org_id: auth_data.membership.org_id,
        user_id: { $ne: null },
      };

      if (name) {
        const users = await User.find({
          name: { $regex: name, $options: "i" },
        }).select("_id");
        const userIds = users.map((user) => user._id);
        membershipQuery.user_id = { $in: userIds };
      }

      const membership = await Membership.find(membershipQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user_id", "name email")
        .populate("org_id", "name");

      const totalUsers = await Membership.countDocuments(membershipQuery);
      const totalPages = Math.ceil(totalUsers / limit);

      return NextResponse.json({
        msg: "For Hr",
        pagination: {
          totalUsers,
          totalPages,
          currentPage: page,
          limit,
        },
        all_members: membership,
      });
    } else if (auth_data.membership.role === "manager") {
      let membershipQuery: any = {
        org_id: auth_data.membership.org_id,
        user_id: { $ne: null },
      };

      if (name) {
        const users = await User.find({
          name: { $regex: name, $options: "i" },
        }).select("_id");
        const userIds = users.map((user) => user._id);
        membershipQuery.user_id = { $in: userIds };
      }

      let all_members = [];

      const membershipHr = await Membership.find({
        role: "hr",
        org_id: auth_data.membership.org_id,
      })
        .populate("user_id")
        .populate("org_id", "name");

      const managedMemberships = await Membership.find({
        manager_id: auth_data.membership.user_id,
        ...membershipQuery,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user_id", "name email")
        .populate("org_id", "name");

      all_members.push(membershipHr);
      all_members.push(managedMemberships);

      // const totalUsers = await Membership.countDocuments(membershipQuery);
      const totalUsers = all_members.length;
      const totalPages = Math.ceil(totalUsers / limit);

      const flattened_members = all_members.flat();

      return NextResponse.json(
        {
          name,
          // org_id,
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
      let membershipQuery: any = {
        org_id: auth_data.membership.org_id,
        user_id: { $ne: null },
      };

      if (name) {
        const users = await User.find({
          name: { $regex: name, $options: "i" },
        }).select("_id");
        const userIds = users.map((user) => user._id);
        membershipQuery.user_id = { $in: userIds };
      }

      let all_members = [];

      const membershipHr = await Membership.find({
        role: "hr",
        org_id: auth_data.membership.org_id,
      })
        .populate("user_id")
        .populate("org_id", "name");

      const users: any = await Membership.findOne({
        user_id: auth_data.membership.user_id,
      })
        .populate("user_id")
        .populate("org_id", "name")
        .populate("manager_id");

      const manager_membership = await Membership.findOne({
        user_id: users.manager_id._id,
      })
        .populate("user_id")
        .populate("org_id", "name");

      all_members.push(membershipHr);
      all_members.push(manager_membership);
      all_members.push(users);

      const totalUsers = await Membership.countDocuments(membershipQuery);
      const totalPages = Math.ceil(totalUsers / limit);

      const flattened_members = all_members.flat();

      return NextResponse.json(
        {
          name,
          // org_id,
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
    }
  } catch (error: any) {
    console.error("Error fetching users and memberships:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
