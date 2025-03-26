import { User } from "@/libs/models";
import { error, success } from "@/utils/resultUtils";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  try {
    const user = await User.findOne({
      attributes: [
        "userAccount",
        "userName",
        "userAvatar",
        "userProfile",
        "createTime",
      ],
      where: { id: userId, isDelete: 0 },
    });
    return success(user);
  } catch (e: any) {
    return error(e);
  }
}
