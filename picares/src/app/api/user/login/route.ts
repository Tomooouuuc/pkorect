import { User } from "@/libs/models";
import { error, ErrorCode, success, throwUtil } from "@/utils/resultUtils";
import { encodePassword } from "../utils";

export async function POST(request: Request) {
  const body: REQUEST.UserLogin = await request.json();
  console.log("开始登录body", body);
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
        "userAvatar",
        "userProfile",
        "userRole",
      ],
      where: {
        userAccount: data.userAccount,
        userPassword: data.userPassword,
      },
    });
    throwUtil(!user, ErrorCode.PARAMS_ERROR, "账号或密码错误");
    return success(user);
  } catch (e: any) {
    console.log("登录错误：", e);
    return error(e);
  }
}
