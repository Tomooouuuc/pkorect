import { sequelize } from "@/libs/database";
import { Categorys, Picture, Picturetag, Tags } from "@/libs/models";
import { error, ErrorCode, success, throwUtil } from "@/utils/resultUtils";
import crypto from "crypto";
import fs from "fs/promises";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import path from "path";
import { Op } from "sequelize";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const session = await getToken({ req: request });
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
      const categoryRes = (await Categorys.findOne({
        attributes: ["id"],
        where: { name: category },
      })) as unknown as RESPONSE.CategorysQuery;
      throwUtil(!categoryRes, ErrorCode.PARAMS_ERROR, "分类不存在");
      data.categoryId = categoryRes.id;

      const findTags = (await Tags.findAll({
        where: {
          name: {
            [Op.in]: tagsList,
          },
        },
        transaction: t,
      })) as unknown as RESPONSE.Tags[];

      const tagNames = new Set(findTags.map((tag) => tag.name));
      const filteredTagsName = tagsList.filter(
        (item: any) => !tagNames.has(item)
      );

      const createTags = (await Tags.bulkCreate(
        filteredTagsName.map((tag: any) => ({ name: tag })),
        { transaction: t }
      )) as unknown as RESPONSE.Tags[];

      const tagIds = [
        ...createTags.map((item) => item.id),
        ...findTags.map((tag) => tag.id),
      ];

      const picture = (await Picture.create(data, {
        transaction: t,
      })) as unknown as RESPONSE.Pictrue;

      await Picturetag.bulkCreate(
        tagIds.map((tagId) => ({ pictureId: picture.id, tagId: tagId })),
        { transaction: t }
      );

      await fs.mkdir(uploadPath, { recursive: true });

      await fs.writeFile(filePath, buffer);
    });

    return success(true);
  } catch (e: any) {
    return error(e);
  }
}
