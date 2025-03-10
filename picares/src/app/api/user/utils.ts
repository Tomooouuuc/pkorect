import crypto from "crypto";

export const encodePassword = (userPassword: string) => {
  return crypto.createHash("md5").update(userPassword).digest("hex");
};

import { ErrorCode, throwUtil } from "@/utils/resultUtils";

export const checkPage = (page: REQUEST.Page) => {
  if (page.sortOrder) {
    page.sortOrder =
      { ascend: "ASC", descend: "DESC" }[page.sortOrder] ?? "error";
  }
  throwUtil(page.sortOrder === "error", ErrorCode.PARAMS_ERROR);
  return {
    ...page,
    current: page.current ?? 1,
    pageSize: page.pageSize ?? 10,
  };
};
