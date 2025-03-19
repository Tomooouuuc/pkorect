"use client";

import { IMAGE_HOST } from "@/constant/user";
import request from "@/libs/request";
import { Card, message } from "antd";
import Meta from "antd/es/card/Meta";
import { useEffect, useState } from "react";

interface Props {
  name: string;
}

const PictureLayout: React.FC<Props> = (props) => {
  const { name } = props;
  const [pictureList, setPictureList] = useState<RESPONSE.Pictrue[]>([]);
  console.log("name:", name);
  useEffect(() => {
    async function getPicture() {
      try {
        const res = await request(`/api/picture?category=${name}`);
        console.log("获取到的图片列表：:", res);
        setPictureList(res.data.rows);
      } catch (e: any) {
        message.error("获取图片列表失败");
      }
    }
    getPicture();
  }, []);
  return (
    <div className="picture_layout">
      // 我想实现瀑布流布局
      {pictureList.map((picture) => {
        return (
          <Card
            hoverable
            style={{ width: 240 }}
            cover={<img alt="example" src={IMAGE_HOST + picture.url} />}
          >
            <Meta title="Europe Street beat" description="www.instagram.com" />
          </Card>
        );
      })}
    </div>
  );
};

export default PictureLayout;
