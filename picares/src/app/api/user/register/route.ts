import { User } from "@/libs/models";
import { error, success } from "@/utils/resultUtils";
import crypto from "crypto";
import { NextRequest } from "next/server";
import { checkBody, encodePassword } from "../../utils";
import { checkUser } from "../utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const filterBody = checkBody(body);
    checkUser(filterBody);
    const { userAccount, userPassword } = body;
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
