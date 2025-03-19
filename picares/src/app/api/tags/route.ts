import { Tags } from "@/libs/models";
import { error, success } from "@/utils/resultUtils";
import { NextRequest } from "next/server";
import { Op } from "sequelize";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  try {
    const name = searchParams.get("name");
    const res = await Tags.findAll({
      attributes: ["name"],
      where: {
        name: {
          [Op.substring]: name,
        },
      },
    });
    return success(res);
  } catch (e: any) {
    return error(e);
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name } = body;
  try {
    await Tags.create({ name });
    return success(true);
  } catch (e: any) {
    return error(e);
  }
}
