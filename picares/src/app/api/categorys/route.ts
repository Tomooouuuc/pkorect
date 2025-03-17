import { Categorys } from "@/libs/models";
import { error, success } from "@/utils/resultUtils";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const res = await Categorys.findAll({ attributes: ["name"] });
    return success(res);
  } catch (e: any) {
    return error(e);
  }
}
