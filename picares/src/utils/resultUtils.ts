import { NextResponse } from "next/server";
import { BusinessException } from "./BusinessException";

type ErrorCodeType = {
  code: number;
  message: string;
};

export const ErrorCode = {
  SUCCESS: { code: 0, message: "ok" },
  PARAMS_ERROR: { code: 40000, message: "请求参数错误" },
  NOT_LOGIN_ERROR: { code: 40100, message: "未登录" },
  NO_AUTH_ERROR: { code: 40101, message: "无权限" },
  NOT_FOUND_ERROR: { code: 40400, message: "请求数据不存在" },
  FORBIDDEN_ERROR: { code: 40300, message: "禁止访问" },
  SYSTEM_ERROR: { code: 50000, message: "系统错误" },
  OPERATION_ERROR: { code: 50001, message: "操作失败" },
};

export const success = (data: any) => {
  return NextResponse.json({
    code: 0,
    data,
    message: "success",
  });
};

export const error = (e: any) => {
  var error = e;
  if (!(e instanceof BusinessException)) {
    error = ErrorCode.SYSTEM_ERROR;
  }
  return NextResponse.json({
    code: error.code,
    data: null,
    message: error.message,
  });
};

export const throwUtil = (
  condition: boolean,
  errorCode: ErrorCodeType,
  message?: string
) => {
  // 参数校验失败后，这里抛出的异常我希望可以被next-auth捕获
  if (condition) {
    throw new BusinessException(errorCode.code, message || errorCode.message);
  }
};
