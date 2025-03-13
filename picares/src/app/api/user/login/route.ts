import { User } from "@/libs/models";
import { error, ErrorCode, success, throwUtil } from "@/utils/resultUtils";
import { encodePassword } from "../../utils";

export async function POST(request: Request) {
  const body: REQUEST.UserLogin = await request.json();
  try {
    throwUtil(
      body.userAccount.length < 4 || body.userAccount.length > 16,
      ErrorCode.PARAMS_ERROR,
      "账号或密码错误"
    );
    throwUtil(
      body.userPassword.length < 6 || body.userPassword.length > 16,
      ErrorCode.PARAMS_ERROR,
      "账号或密码错误"
    );

    const password = encodePassword(body.userPassword);

    const data: MODEL.UserLogin = {
      ...body,
      userPassword: password,
    };

    const user = await User.findOne({
      attributes: [
        "id",
        "userAccount",
        "userName",
        "userAvatar",
        "userProfile",
        "userRole",
      ],
      where: {
        userAccount: data.userAccount,
        userPassword: data.userPassword,
        isDelete: 0,
      },
    });
    throwUtil(!user, ErrorCode.PARAMS_ERROR, "账号或密码错误");
    return success(user);
  } catch (e: any) {
    return error(e);
  }
}
