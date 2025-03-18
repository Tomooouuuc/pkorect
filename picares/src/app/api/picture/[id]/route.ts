import { sequelize } from "@/libs/database";
import { Categorys, Picture, Picturetag, Tags } from "@/libs/models";
import { error, ErrorCode, success, throwUtil } from "@/utils/resultUtils";
import { NextRequest } from "next/server";
import { Op } from "sequelize";
import { checkPicture } from "../utils";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await Picture.update({ isDelete: 1 }, { where: { id: id } });
    return success(true);
  } catch (e: any) {
    return error(e);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  console.log("拿到的提交的值：", body);
  checkPicture(body);
  const { categoryName, tagsList, ...restBody } = body;

  try {
    await sequelize.transaction(async (t) => {
      const categorys = (await Categorys.findOne({
        where: { name: categoryName },
        transaction: t,
      })) as unknown as RESPONSE.Categorys;
      throwUtil(!categorys, ErrorCode.PARAMS_ERROR);
      const tags = (await Tags.findAll({
        where: {
          name: {
            [Op.in]: tagsList,
          },
        },
        transaction: t,
      })) as unknown as RESPONSE.Tags[];

      const tagNames = new Set(tags.map((tag) => tag.name));
      const filteredTagsName = tagsList.filter(
        (item: any) => !tagNames.has(item)
      );

      const createTags = (await Tags.bulkCreate(
        filteredTagsName.map((tag: any) => ({ name: tag })),
        { transaction: t }
      )) as unknown as RESPONSE.Tags[];

      const tagIds = [
        ...createTags.map((item) => item.id),
        ...tags.map((tag) => tag.id),
      ];

      const filterBody = { ...restBody, categoryId: categorys.id };
      await Picture.update(filterBody, { where: { id: id }, transaction: t });

      await Picturetag.destroy({ where: { pictureId: id }, transaction: t });
      await Picturetag.bulkCreate(
        tagIds.map((tagId) => ({ pictureId: id, tagId: tagId })),
        { transaction: t }
      );
    });
    return success(true);
  } catch (e: any) {
    return error(e);
  }
}
