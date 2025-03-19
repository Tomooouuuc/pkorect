import { Categorys, Picture, Tags } from "@/libs/models";
import { error, success } from "@/utils/resultUtils";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");

  try {
    const picture = (await Picture.findAndCountAll({
      attributes: ["id", "url", "name"],
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
      subQuery: false,
    })) as unknown as RESPONSE.Page<RESPONSE.Pictrue>;
    const res: RESPONSE.Page<RESPONSE.Pictrue> = {
      rows: picture.rows,
      count: picture.count,
    };
    return success(res);
  } catch (e: any) {
    return error(e);
  }
}
