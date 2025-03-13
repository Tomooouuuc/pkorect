import { User } from "@/libs/models";
import { ErrorCode, throwUtil } from "@/utils/resultUtils";
import { Transaction } from "sequelize";

export async function updateUser(
  attr: MODEL.UserUpdate,
  id: string,
  t?: Transaction
) {
  try {
    const [res] = await User.update(
      { ...attr },
      {
        where: {
          id: id,
        },
        transaction: t,
      }
    );
    throwUtil(res === 0, ErrorCode.NOT_FOUND_ERROR, "用户不存在");
  } catch (e: any) {
    throwUtil(true, ErrorCode.SYSTEM_ERROR, "操作失败");
  }
}
