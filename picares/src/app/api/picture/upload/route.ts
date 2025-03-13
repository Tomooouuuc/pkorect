import { sequelize } from "@/libs/database";
import { Picture } from "@/libs/models";
import { error } from "@/utils/resultUtils";
import crypto from "crypto";
import fs from "fs/promises";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import path from "path";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    const userAccount = session?.user.userAccount;
    const userId = session?.user.id;
    const formData = await request.formData();

    const image = formData.get("image") as File;
    const nameValue = formData.get("name");
    const name =
      (typeof nameValue === "string" ? nameValue.trim() : "") ||
      "图片" + crypto.randomBytes(6).readUInt32BE(0);
    const introduction = formData.get("introduction") as string;
    const category = formData.get("category") as string;

    const buffer = Buffer.from(await image.arrayBuffer());
    const metadata = await sharp(buffer).metadata();

    const format = metadata.format;

    const fileName =
      crypto.randomBytes(4).readUInt32BE(0) + Date.now() + "." + format;
    const imagePath = path.join("images", userAccount!); // `/images/${userAccount}`;
    const uploadPath = path.join(process.cwd(), imagePath);
    const filePath = path.join(uploadPath, fileName);

    const width = metadata.width;
    const height = metadata.height;
    const data: MODEL.PictureUpload = {
      url: path.join(imagePath, fileName),
      name: name,
      introduction: introduction,
      category: category,
      picSize: metadata.size,
      picWidth: width,
      picHeight: height,
      picScale: (metadata.width! / metadata.height!).toFixed(2),
      picFormat: format,
      userId: userId!,
    };

    sequelize.transaction(async (t) => {
      await Picture.create(data, { transaction: t });

      await fs.mkdir(uploadPath, { recursive: true });

      await fs.writeFile(filePath, buffer);
    });
  } catch (e: any) {
    return error(e);
  }
}
