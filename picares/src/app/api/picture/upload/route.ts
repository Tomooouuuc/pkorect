import { sequelize } from "@/libs/database";
import { error, ErrorCode, success, throwUtil } from "@/utils/resultUtils";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import path from "path";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getImageInfo, getTagIds, insertImage } from "./service";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const userAccount = session?.user.userAccount;
    const userId = session?.user.id;

    const formData = await request.formData();

    const image = formData.get("image") as File;
    const name =
      (formData.get("name") as string) ||
      `图片${crypto.randomInt(100000, 999999)}`;
    const introduction = formData.get("introduction") as string;
    const category = formData.get("category") as string;
    throwUtil(!category, ErrorCode.PARAMS_ERROR, "目录不能为空");
    const tags = formData.get("tags") as string;
    throwUtil(!tags, ErrorCode.PARAMS_ERROR, "标签不能为空");
    const tagsList = tags.split(",");

    const buffer = Buffer.from(await image.arrayBuffer());

    const { format, width, height, size } = await getImageInfo(buffer);

    const imagePath = path.join("/images/user", userAccount!);

    const data: MODEL.PictureUpload = {
      name: name,
      introduction: introduction,
      picSize: size,
      picWidth: width,
      picHeight: height,
      picScale: (width! / height!).toFixed(2),
      picFormat: format,
      reviewStatus: 0,
      userId: userId!,
    };
    sequelize.transaction(async (t) => {
      const tagIds = await getTagIds(tagsList, t);
      insertImage({ imagePath, format }, data, buffer, tagIds, t);
    });

    return success(true);
  } catch (e: any) {
    return error(e);
  }
}
