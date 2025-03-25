import { Picture, Tags } from "@/libs/models";
import { error, success } from "@/utils/resultUtils";
import { NextRequest } from "next/server";
import { Op } from "sequelize";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get("name");
  const id = searchParams.get("id");

  const where: any = { isDelete: 0 };
  if (id) {
    where.id = {
      [Op.gt]: id,
    };
  }

  try {
    const picture = (await Picture.findAll({
      attributes: ["id"],
      include: {
        model: Tags,
        where: { name: name },
        through: { attributes: [] },
      },
      where,
      limit: 10,
      subQuery: true,
    })) as unknown as RESPONSE.Pictrue[];
    const pictureIds = picture.map((item) => item.id);
    const res = await Picture.findAll({
      attributes: ["id", "url", "picScale", "name"],
      include: [
        {
          model: Tags,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
      where: {
        id: {
          [Op.in]: pictureIds,
        },
      },
      subQuery: false,
    });
    return success(res);
  } catch (e: any) {
    return error(e);
  }
}
