import { Categorys, Picture, Tags } from "@/libs/models";
import { error, success } from "@/utils/resultUtils";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { Op } from "sequelize";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  var reviewStatus = searchParams.get("reviewStatus") as unknown as number;
  const id = searchParams.get("id");
  const pictureId = searchParams.get("pictureId");

  const session = await getServerSession(authOptions);
  const userId = session?.user.id.toString();

  const isUser = userId === id;
  if (!isUser) {
    reviewStatus = 1;
  }

  try {
    const where: any = { isDelete: 0, userId: id, reviewStatus: reviewStatus };
    if (pictureId) {
      where.id = {
        [Op.gt]: pictureId,
      };
    }
    const picture = (await Picture.findAll({
      attributes: ["id", "url", "picScale", "name"],
      include: [
        {
          model: Categorys,
          attributes: [],
          where: { name: category },
        },
        {
          model: Tags,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
      where,
      limit: 10,
      subQuery: true,
    })) as unknown as RESPONSE.Pictrue[];

    return success(picture);
  } catch (e: any) {
    return error(e);
  }
}
