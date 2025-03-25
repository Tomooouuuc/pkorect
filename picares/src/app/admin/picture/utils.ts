import request from "@/libs/request";
import { message } from "antd";

export const fetchUserList = async (name: string) => {
  try {
    const res = await request(`/api/tags?name=${name}`);
    return res.data.map((item: any) => ({
      label: item.name,
      value: item.name,
    }));
  } catch (e: any) {
    message.error("获取标签失败");
  }
};
