import { Picture } from "@/libs/models";
import { error, ErrorCode, success, throwUtil } from "@/utils/resultUtils";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, reviewStatus } = body;
  if (reviewStatus !== 1 && reviewStatus !== 2) {
    throwUtil(true, ErrorCode.PARAMS_ERROR);
  }
  try {
    await Picture.update({ reviewStatus }, { where: { id: id } });
    return success(true);
  } catch (e: any) {
    return error(e);
  }
}
