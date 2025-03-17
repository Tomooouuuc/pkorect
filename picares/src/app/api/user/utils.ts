import { roleLevels, UserRole } from "@/config/userRole";
import { ErrorCode, throwUtil } from "@/utils/resultUtils";

export const checkUser = (user: any) => {
  if ("userAccount" in user) {
    throwUtil(
      user.userAccount.length < 4 || user.userAccount.length > 16,
      ErrorCode.PARAMS_ERROR,
      "账号长度不符合要求"
    );
    throwUtil(
      !/^[a-zA-Z0-9]+$/.test(user.userAccount),
      ErrorCode.PARAMS_ERROR,
      "账号包含非法字符"
    );
  }
  if ("userPassword" in user) {
    throwUtil(
      user.userPassword.length < 6 || user.userPassword.length > 16,
      ErrorCode.PARAMS_ERROR,
      "密码长度不符合要求"
    );
  }
  if ("checkPassword" in user) {
    throwUtil(
      user.checkPassword.length < 6 || user.checkPassword.length > 16,
      ErrorCode.PARAMS_ERROR,
      "密码长度不符合要求"
    );
    throwUtil(
      user.userPassword !== user.checkPassword,
      ErrorCode.PARAMS_ERROR,
      "两次密码不一致"
    );
  }
  if ("userName" in user) {
    throwUtil(
      user.userName.length > 16,
      ErrorCode.PARAMS_ERROR,
      "昵称长度过长"
    );
  }
  if ("userProfile" in user) {
    throwUtil(
      user.userProfile.length > 128,
      ErrorCode.PARAMS_ERROR,
      "个人简介长度过长"
    );
  }
  if ("userRole" in user) {
    throwUtil(
      roleLevels[user.userRole as UserRole] === undefined,
      ErrorCode.PARAMS_ERROR
    );
  }
};
