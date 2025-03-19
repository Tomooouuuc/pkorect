import { sequelize } from "@/libs/database";
import { Categorys, Picture } from "@/libs/models";
import { error, success } from "@/utils/resultUtils";
import { NextRequest } from "next/server";
import { Op } from "sequelize";
import { checkBody, checkPage } from "../../utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { current, pageSize, sortField, sortOrder, ...restBody } = body;
    const page = checkPage({ current, pageSize, sortField, sortOrder });
    const filterBody = checkBody(restBody);

    const whereConditions: any[] = [{ isDelete: 0 }];
    if ("name" in filterBody) {
      whereConditions.push({ name: { [Op.substring]: filterBody.name } });
    }

    const query: any = {
      where: { [Op.and]: whereConditions },
    };

    const count = (await Categorys.count({
      ...query,
    })) as unknown as number;

    if (page.sortField && page.sortOrder) {
      query.order = [[page.sortField, page.sortOrder]];
    }
    query.limit = page.pageSize;
    query.offset = page.current;
    const data = (await Categorys.findAll({
      attributes: [
        "id",
        "name",
        "createTime",
        [sequelize.fn("COUNT", sequelize.col("Pictures.id")), "pictureCount"],
      ],
      ...query,
      include: [
        {
          model: Picture,
          attributes: [],
          required: false,
        },
      ],
      group: ["Categorys.id"],
      subQuery: false,
    })) as unknown as RESPONSE.Categorys[];
    const res: RESPONSE.Page<RESPONSE.Categorys> = {
      rows: data,
      count: count,
    };
    return success(res);
  } catch (e: any) {
    return error(e);
  }
}
