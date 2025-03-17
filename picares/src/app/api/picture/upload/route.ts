import { sequelize } from "@/libs/database";
import { Picture } from "@/libs/models";
import { error, ErrorCode, success, throwUtil } from "@/utils/resultUtils";
import crypto from "crypto";
import fs from "fs/promises";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import path from "path";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    // const userAccount = session?.user.userAccount;
    const userAccount = "12345";

    // const userId = session?.user.id;
    const userId = "123456";

    const formData = await request.formData();

    const image = formData.get("image") as File;
    const name =
      (formData.get("name") as string) ||
      `图片${crypto.randomInt(100000, 999999)}`;
    const introduction = formData.get("introduction") as string;
    const category = formData.get("category") as string;
    throwUtil(!category, ErrorCode.PARAMS_ERROR, "分类不能为空");

    const tags = formData.get("tags");
    throwUtil(!tags, ErrorCode.PARAMS_ERROR, "标签不能为空");

    const buffer = Buffer.from(await image.arrayBuffer());
    const metadata = await sharp(buffer).metadata();

    const format = metadata.format;

    const fileName =
      crypto.randomBytes(4).readUInt32BE(0) + Date.now() + "." + format;
    const imagePath = path.join("/images", userAccount!);
    const uploadPath = path.join(process.cwd(), imagePath);
    const filePath = path.join(uploadPath, fileName);

    const width = metadata.width;
    const height = metadata.height;
    const data: MODEL.PictureUpload = {
      url: path.join(imagePath, fileName),
      name: name,
      introduction: introduction,
      picSize: metadata.size,
      picWidth: width,
      picHeight: height,
      picScale: (metadata.width! / metadata.height!).toFixed(2),
      picFormat: format,
      userId: userId!,
    };

    sequelize.transaction(async (t) => {
      // const categoryRes = (await Categorys.findOne({
      //   attributes: ["id"],
      //   where: { name: category },
      // })) as unknown as RESPONSE.CategorysQuery;
      // throwUtil(!categoryRes, ErrorCode.PARAMS_ERROR, "分类不存在");
      // data.category = categoryRes.id;

      await Picture.create(data, { transaction: t });

      await fs.mkdir(uploadPath, { recursive: true });

      await fs.writeFile(filePath, buffer);
    });

    return success(true);
  } catch (e: any) {
    return error(e);
  }
}
