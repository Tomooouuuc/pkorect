import { Categorys, Picture, Tags } from "@/libs/models";
import { error, success } from "@/utils/resultUtils";
import { NextRequest } from "next/server";
import { Op } from "sequelize";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const id = searchParams.get("id");
  const where: any = { reviewStatus: 1, isDelete: 0 };
  const include: any[] = [
    {
      model: Tags,
      attributes: ["name"],
      through: { attributes: [] },
    },
  ];
  if (id) {
    where.id = {
      [Op.gt]: id,
    };
  }
  if (category) {
    include.push({
      model: Categorys,
      attributes: [],
      where: { name: category, isDelete: 0 },
    });
  }

  try {
    const picture = (await Picture.findAll({
      attributes: ["id", "url", "picScale", "name"],
      include,
      where,
      limit: 10,
      subQuery: true,
    })) as unknown as RESPONSE.Pictrue[];
    return success(picture);
  } catch (e: any) {
    return error(e);
  }
}
