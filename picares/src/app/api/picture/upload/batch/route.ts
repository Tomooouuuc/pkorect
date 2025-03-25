import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { error, ErrorCode, success, throwUtil } from "@/utils/resultUtils";
import axios from "axios";
import * as cheerio from "cheerio"; // 引入Cheerio库
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { fetchImage } from "../service";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userAccount = session?.user.userAccount;
  const userId = session?.user.id;

  const body = await request.json();
  var { name, count, category, tagsList } = body;
  try {
    if (!name) {
      throwUtil(true, ErrorCode.PARAMS_ERROR, "请输入搜索内容");
    }
    if (!count) {
      count = 10;
    }
    if (count > 30) {
      throwUtil(true, ErrorCode.PARAMS_ERROR, "最多30张");
    }

    const { data } = await axios.get(
      `https://cn.bing.com/images/async?q=${name}&mmasync=1`
    );

    const $ = cheerio.load(data);
    var uploadCount = 0;
    const imgList: string[] = [];

    const mimg = $(".dgControl")
      .find("img.mimg")
      .each((index, element) => {
        if (uploadCount >= count) {
          return false;
        }
        const src = $(element).attr("src");
        if (!src) {
          return true;
        }
        const img = src.split("?")[0];

        imgList.push(img);
        uploadCount++;
      });
    fetchImage(imgList, name, category, tagsList, userAccount!, userId!);

    return success(true);
  } catch (e: any) {
    return error(e);
  }
}
