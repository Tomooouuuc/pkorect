import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ type: string; userAccount: string; imageName: string }>;
  }
) {
  const { type, userAccount, imageName } = await params;
  const filePath = path.join(process.cwd(), type, userAccount, imageName);

  const image = await fs.readFile(filePath);
  return new NextResponse(image, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });
}
