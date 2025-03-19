import { sequelize } from "@/libs/database";
import { Picture, Tags } from "@/libs/models";
import { error, success } from "@/utils/resultUtils";
import { NextRequest } from "next/server";
import { Op } from "sequelize";
import { checkBody, checkPage } from "../../utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("body", body);
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

    const count = (await Tags.count({
      ...query,
    })) as unknown as number;

    if (page.sortField && page.sortOrder) {
      query.order = [[page.sortField, page.sortOrder]];
    }
    query.limit = page.pageSize;
    query.offset = page.current;
    const data = (await Tags.findAll({
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
          through: { attributes: [] },
        },
      ],
      group: ["Tags.id"],
      subQuery: false,
    })) as unknown as RESPONSE.Tags[];
    console.log("结果是：", data);
    const res: RESPONSE.Page<RESPONSE.Tags> = {
      rows: data,
      count: count,
    };
    return success(res);
  } catch (e: any) {
    return error(e);
  }
}
