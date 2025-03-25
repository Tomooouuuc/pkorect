import { sequelize } from "@/libs/database";
import { Categorys, Picture, Picturetag, Tags } from "@/libs/models";
import { ErrorCode, throwUtil } from "@/utils/resultUtils";
import axios from "axios";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { Op, Transaction } from "sequelize";
import sharp from "sharp";

interface PathInfo {
  imagePath: string;
  format: string;
}

export const fetchImage = async (
  imgList: string[],
  name: string,
  category: string,
  tagsList: string[],
  userAccount: string,
  userId: string
) => {
  const categoryRes = (await Categorys.findOne({
    attributes: ["id"],
    where: { name: category },
  })) as unknown as RESPONSE.CategorysQuery;
  throwUtil(!categoryRes, ErrorCode.PARAMS_ERROR, "目录不存在");
  sequelize.transaction(async (t) => {
    const tagIds = await getTagIds(tagsList, t);

    for (const img of imgList) {
      const response = await axios.get(img, { responseType: "arraybuffer" });

      const arrayBuffer = response.data;

      const buffer = Buffer.from(arrayBuffer);

      const { format, width, height, size } = await getImageInfo(buffer);

      const imagePath = path.join("/image", userAccount!);

      const imageName = name + crypto.randomInt(100000, 999999);
      const data: MODEL.PictureUpload = {
        name: imageName,
        picSize: size,
        picWidth: width,
        picHeight: height,
        picScale: (width! / height!).toFixed(2),
        picFormat: format,
        reviewStatus: 1,
        userId: userId,
      };

      data.categoryId = categoryRes.id;

      await insertImage({ imagePath, format }, data, buffer, tagIds, t);
    }
  });
};

export const getTagIds = async (tagsList: string[], t: Transaction) => {
  const findTags = (await Tags.findAll({
    where: {
      name: {
        [Op.in]: tagsList,
      },
    },
  })) as unknown as RESPONSE.Tags[];

  const tagNames = new Set(findTags.map((tag) => tag.name));
  const filteredTagsName = tagsList.filter((item: any) => !tagNames.has(item));

  const createTags = (await Tags.bulkCreate(
    filteredTagsName.map((tag: any) => ({ name: tag })),
    { transaction: t }
  )) as unknown as RESPONSE.Tags[];

  const tagIds = [
    ...createTags.map((item) => item.id),
    ...findTags.map((tag) => tag.id),
  ];
  return tagIds;
};

export const getImageInfo = async (buffer: Buffer) => {
  const metadata = await sharp(buffer).metadata();

  const format = metadata.format as string;
  const width = metadata.width;
  const height = metadata.height;
  const size = metadata.size;

  return { format, width, height, size };
};

const getImagePathInfo = (pathInfo: PathInfo) => {
  const { imagePath, format } = pathInfo;
  const fileName =
    crypto.randomBytes(4).readUInt32BE(0) + Date.now() + "." + format;
  const uploadPath = path.join(process.cwd(), imagePath);

  const filePath = path.join(uploadPath, fileName);

  return { imagePath, uploadPath, filePath, fileName };
};

export const insertImage = async (
  pathInfo: PathInfo,
  data: MODEL.PictureUpload,
  buffer: Buffer,
  tagIds: number[],
  t: Transaction
) => {
  const { imagePath, uploadPath, filePath, fileName } =
    getImagePathInfo(pathInfo);

  data.url = path.join(imagePath, fileName);

  const picture = (await Picture.create(data, {
    transaction: t,
  })) as unknown as RESPONSE.Pictrue;

  await Picturetag.bulkCreate(
    tagIds.map((tagId) => ({ pictureId: picture.id, tagId: tagId })),
    { transaction: t }
  );

  await fs.mkdir(uploadPath, { recursive: true });

  await fs.writeFile(filePath, buffer);
};
