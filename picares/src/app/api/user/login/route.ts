import { User } from "@/libs/models";
import { error, ErrorCode, success, throwUtil } from "@/utils/resultUtils";
import { encodePassword } from "../utils";

export async function POST(request: Request) {
  const body: REQUEST.UserLogin = await request.json();
  throwUtil(
    body.userAccount.length < 4 || body.userAccount.length > 16,
    ErrorCode.PARAMS_ERROR
  );
  throwUtil(
    body.userPassword.length < 6 || body.userPassword.length > 16,
    ErrorCode.PARAMS_ERROR
  );

  const password = encodePassword(body.userPassword);

  const data: MODEL.UserLogin = {
    ...body,
    userPassword: password,
  };

  try {
    const user = await User.findOne({
      where: {
        userAccount: data.userAccount,
        userPassword: data.userPassword,
      },
    });
    throwUtil(!user, ErrorCode.OPERATION_ERROR, "账号或密码错误");
    return success(user);
  } catch (e: any) {
    return error(e);
  }
}
