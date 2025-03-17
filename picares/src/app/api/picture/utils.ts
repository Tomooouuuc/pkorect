import { ErrorCode, throwUtil } from "@/utils/resultUtils";

export const checkPicture = (picture: any) => {
  if ("name" in picture) {
    throwUtil(picture.name.length > 16, ErrorCode.PARAMS_ERROR, "图片名称过长");
  }
  if ("introduction" in picture) {
    throwUtil(
      picture.introduction.length > 32,
      ErrorCode.PARAMS_ERROR,
      "图片简介过长"
    );
  }
};
