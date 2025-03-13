import { User } from "@/libs/models";
import { error, ErrorCode, success, throwUtil } from "@/utils/resultUtils";
import crypto from "crypto";
import { NextRequest } from "next/server";
import { encodePassword } from "../../utils";

export async function POST(request: NextRequest) {
  try {
    const body: REQUEST.UserRegister = await request.json();
    const { userAccount, userPassword, checkPassword } = body;
    throwUtil(
      userAccount.length < 4 || userAccount.length > 16,
      ErrorCode.PARAMS_ERROR,
      "账号长度不符合要求"
    );
    const pattern = /^[a-zA-Z0-9]+$/;
    throwUtil(
      !pattern.test(userAccount),
      ErrorCode.PARAMS_ERROR,
      "账号包含非法字符"
    );
    throwUtil(
      userPassword.length < 6 || checkPassword.length < 6,
      ErrorCode.PARAMS_ERROR,
      "密码过短"
    );
    throwUtil(
      userPassword.length > 16 || checkPassword.length > 16,
      ErrorCode.PARAMS_ERROR,
      "密码过长"
    );
    throwUtil(
      userPassword !== checkPassword,
      ErrorCode.PARAMS_ERROR,
      "两次密码不一致"
    );

    const password = encodePassword(userPassword);
    const userName = "游客" + crypto.randomInt(100000, 999999);
    const data: MODEL.UserRegister = {
      userAccount: userAccount,
      userPassword: password,
      userName: userName,
    };
    await User.create(data);
    return success(true);
  } catch (e: any) {
    // 相同数据插入两次没有捕获到错误，userAccount在数据库中设置了唯一索引
    return error(e);
  }
}
