import { sequelize } from "@/libs/database";
import { Categorys, Picture } from "@/libs/models";
import { error, ErrorCode, success, throwUtil } from "@/utils/resultUtils";
import { NextRequest } from "next/server";
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
  const { categoryName, ...restBody } = body;

  try {
    await sequelize.transaction(async (t) => {
      const categorys = (await Categorys.findOne({
        where: { name: categoryName },
        transaction: t,
      })) as unknown as RESPONSE.Categorys;
      throwUtil(!categorys, ErrorCode.PARAMS_ERROR);
      const filterBody = { ...restBody, categoryId: categorys.id };
      await Picture.update(filterBody, { where: { id: id }, transaction: t });
    });
    return success(true);
  } catch (e: any) {
    return error(e);
  }
}
