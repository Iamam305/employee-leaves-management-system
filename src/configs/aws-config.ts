import { S3 } from "@aws-sdk/client-s3";

const s3_bucket = new S3({
  endpoint: process.env.AWS_S3_ENDPOINT!,
  forcePathStyle: true,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_S3_ACCESS_SECRET!,
  },
});

export default s3_bucket;
