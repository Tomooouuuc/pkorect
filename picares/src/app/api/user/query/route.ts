import { User } from "@/libs/models";
import { error, success } from "@/utils/resultUtils";
import { NextRequest } from "next/server";
import { Op } from "sequelize";
import { checkBody, checkPage } from "../../utils";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { current, pageSize, sortField, sortOrder, ...restBody } = body;
  const page = checkPage({ current, pageSize, sortField, sortOrder });
  const filterBody = checkBody(restBody);
  try {
    const whereConditions: any[] = [{ isDelete: 0 }];
    for (const [key, value] of Object.entries(filterBody)) {
      if (["userProfile", "userName", "userAccount"].includes(key)) {
        whereConditions.push({ [key]: { [Op.substring]: value } });
      } else {
        whereConditions.push({ [key]: value });
      }
    }

    const query: any = {
      where: { [Op.and]: whereConditions },
    };

    if (page.sortField && page.sortOrder) {
      query.order = [[page.sortField, page.sortOrder]];
    }
    query.limit = page.pageSize;
    query.offset = page.current;
    //报错：对象字面量只能指定已知属性，并且“query”不在类型“FindOptions<any>”中。ts(2353)
    const user = (await User.findAndCountAll({
      attributes: [
        "id",
        "userAccount",
        "userName",
        "userAvatar",
        "userProfile",
        "userRole",
        "createTime",
      ],
      ...query,
    })) as unknown as RESPONSE.Page<RESPONSE.User>;
    const res: RESPONSE.Page<RESPONSE.User> = {
      rows: user.rows,
      count: user.count,
    };
    return success(res);
  } catch (e: any) {
    return error(e);
  }
}
