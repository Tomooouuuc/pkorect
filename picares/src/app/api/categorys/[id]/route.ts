import { Categorys } from "@/libs/models";
import { error, success } from "@/utils/resultUtils";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log("id是========", id);
  try {
    await Categorys.update({ isDelete: 1 }, { where: { id: id } });
    return success(true);
  } catch (e: any) {
    return error(e);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { name } = body;
  try {
    await Categorys.update({ name: name }, { where: { id: id } });
    return success(true);
  } catch (e: any) {
    return error(e);
  }
}
