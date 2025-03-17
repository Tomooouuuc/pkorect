import { sequelize } from "@/libs/database";
import { User } from "@/libs/models";
import { error, ErrorCode, success, throwUtil } from "@/utils/resultUtils";
import crypto from "crypto";
import fs from "fs/promises";
import { NextRequest } from "next/server";
import path from "path";
import sharp from "sharp";
import { checkUser } from "../utils";
import { updateUser } from "./service";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await User.update({ isDelete: 1 }, { where: { id: id } });
    return success(true);
  } catch (e: any) {
    return error(e);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const formData = await request.formData();
    const avatar = formData.get("avatar") as File;
    const userAccount = formData.get("userAccount") as string;
    const attr: MODEL.UserUpdate = {
      userName: formData.get("userName") as string,
      userProfile: formData.get("userProfile") as string,
      userRole: formData.get("userRole") as string,
    };

    checkUser({ ...attr, userAccount });
    if (!avatar) {
      updateUser(attr, id);
    } else {
      const buffer = Buffer.from(await avatar.arrayBuffer());
      const metadata = await sharp(buffer).metadata();

      const format = metadata.format;
      if (!format) {
        throwUtil(true, ErrorCode.PARAMS_ERROR, "图片格式错误");
      }
      const fileName =
        crypto.randomBytes(4).readUInt32BE(0) + Date.now() + "." + format;
      const avatarPath = path.join("/avatar", userAccount!);
      const imagesPath = path.join(process.cwd(), avatarPath);
      const filePath = path.join(imagesPath, fileName);
      attr.userAvatar = path.join(avatarPath, fileName);

      await sequelize.transaction(async (t) => {
        await updateUser(attr, id, t);

        await fs.mkdir(imagesPath, { recursive: true });
        await fs.writeFile(filePath, buffer);
      });
    }
    return success(true);
  } catch (e: any) {
    return error(e);
  }
}
