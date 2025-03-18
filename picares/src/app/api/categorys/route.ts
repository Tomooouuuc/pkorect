import { Categorys } from "@/libs/models";
import { error, success } from "@/utils/resultUtils";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name } = body;
  try {
    await Categorys.create({ name });
    return success(true);
  } catch (e: any) {
    return error(e);
  }
}
