import { User } from "@/libs/models";
import { error, success } from "@/utils/resultUtils";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { checkPage } from "./utils";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  // 输出是null
  // console.log("获取登录用户的session：", session);
  const body = await request.json();
  const { current, pageSize, sortField, sortOrder, ...restBody } = body;
  const page = checkPage({ current, pageSize, sortField, sortOrder });

  try {
    const query: any = {
      where: {
        ...restBody,
      },
    };
    if (page.sortField && page.sortOrder) {
      query.order = [[page.sortField, page.sortOrder]];
    }
    const count = (await User.count(query)) as unknown as number;
    query.limit = page.pageSize;
    query.offset = page.pageSize * (page.current - 1);
    const user = (await User.findAll(query)) as unknown as RESPONSE.User[];
    const res: RESPONSE.Page<RESPONSE.User> = {
      records: user,
      total: count,
    };
    return success(res);
  } catch (e: any) {
    return error(e);
  }
}
