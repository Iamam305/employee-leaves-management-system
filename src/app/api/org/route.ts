import { connect_db } from "@/configs/db";
import { Org } from "@/models/org.model";
import { NextRequest, NextResponse } from "next/server";

connect_db();

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
