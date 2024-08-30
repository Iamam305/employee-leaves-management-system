import s3_bucket from "@/configs/aws-config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { uid } from "uid";

export async function POST(req: NextRequest) {
  try {
    const form_data = await req.formData();
    const file = form_data.get("file") as File;
    const Body = (await file.arrayBuffer()) as Buffer;
    const file_key = `doc/${uid()}_${file.name}`;
    const upload_file = await s3_bucket.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: file_key,
        Body: Body,
        ACL: "public-read",
      })
    );
    return NextResponse.json(
      {
        msg: "File Uploaded Successfully",
        upload_file,
        file_key,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        msg: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
