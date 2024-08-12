import { connect_db } from "@/configs/db";
import { auth_middleware } from "@/lib/auth-middleware";
import { Org } from "@/models/org.model";
import { NextRequest, NextResponse } from "next/server";

connect_db();

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    const auth:any = await auth_middleware(req);
    if (auth[0] === null || auth[1] !== null) {
      console.error("Authentication error:", auth[1]);
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }
    const auth_data = auth[0];
    if (auth_data.membership.role !== "admin") {
      return NextResponse.json({
        msg: "Only admin can create the organization",
      });
    }
    const new_org = await Org.create({ name });
    return NextResponse.json(
      {
        msg: "Organization Created Successfully",
        new_org,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest) {
  try {
    const all_orgs = await Org.find();
    return NextResponse.json(
      {
        all_orgs,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching orgs:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
