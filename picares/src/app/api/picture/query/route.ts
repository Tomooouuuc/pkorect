import { Categorys, Picture, Tags, User } from "@/libs/models";
import { error, success } from "@/utils/resultUtils";
import { NextRequest } from "next/server";
import { Op } from "sequelize";
import { checkBody, checkPage } from "../../utils";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { current, pageSize, sortField, sortOrder, ...restBody } = body;
  console.log("bodyb", body);

  const page = checkPage({ current, pageSize, sortField, sortOrder });
  const filterBody = checkBody(restBody);
  console.log("filterBody", filterBody);

  try {
    const pictureConditions: any[] = [{ isDelete: 0 }];
    const userConditions: any[] = [{ isDelete: 0 }];
    const categoryConditions: any[] = [{ isDelete: 0 }];
    const tagsConditions: any[] = [{ isDelete: 0 }];
    for (const [key, value] of Object.entries(filterBody)) {
      if (["name", "introduction"].includes(key)) {
        pictureConditions.push({ [key]: { [Op.substring]: value } });
      } else if (["picFormat"].includes(key)) {
        pictureConditions.push({ [key]: value });
      } else if (["userAccount"].includes(key)) {
        userConditions.push({ [key]: { [Op.substring]: value } });
      } else if (["categoryName"].includes(key)) {
        categoryConditions.push({ ["name"]: { [Op.substring]: value } });
      } else if (["tagsList"].includes(key)) {
        // 我想将这个查询条件放在外层
        tagsConditions.push({ ["name"]: { [Op.in]: value } });
      }
    }
    //'$Instruments.size$': { [Op.ne]: 'small' },
    const query: any = {
      where: { [Op.and]: pictureConditions },
    };

    const includeUser: any = {
      model: User,
      where: { [Op.and]: userConditions },
    };
    const includeCategorys: any = {
      model: Categorys,
      where: { [Op.and]: categoryConditions },
    };
    const includeTags: any = {
      model: Tags,
      // where: { [Op.and]: tagsConditions },
      through: { attributes: [] },
    };
    const include: any = [includeUser, includeCategorys, includeTags];

    const count = (await Picture.count({
      ...query,
      include,
      distinct: true,
    })) as unknown as number;

    includeUser.attributes = ["userAccount"];
    includeCategorys.attributes = ["name"];
    includeTags.attributes = ["name"];

    if (page.sortField && page.sortOrder) {
      query.order = [[page.sortField, page.sortOrder]];
    }
    query.limit = page.pageSize;
    query.offset = page.current;

    var picture = (await Picture.findAll({
      attributes: [
        "id",
        "url",
        "name",
        "introduction",
        "picSize",
        "picWidth",
        "picHeight",
        "picScale",
        "picFormat",
        "createTime",
      ],
      ...query,
      include,
    })) as unknown as RESPONSE.Pictrue[];
    console.log("veliveli");
    if ("tagsList" in filterBody) {
      const { tagsList } = filterBody;

      picture = picture.filter((item) => {
        if (Array.isArray(tagsList)) {
          return tagsList.every((tagName) =>
            item.tags.some((tag) => tag.name === tagName)
          );
        }
      });
    }

    const res: RESPONSE.Page<RESPONSE.Pictrue> = {
      records: picture,
      total: count,
    };
    return success(res);
  } catch (e: any) {
    return error(e);
  }
}
