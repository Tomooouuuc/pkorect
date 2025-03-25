"use client";
import PictureLayout from "@/app/components/PictureLayout";
import { IMAGE_HOST } from "@/constant/user";
import request from "@/libs/request";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Card, Flex, Image, Menu, message, Space, Tag, Typography } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import "./index.css";

interface Props {
  isUser: boolean;
  name: string;
  id: string;
}

const UserPicture: React.FC<Props> = ({ isUser, name, id }) => {
  const [hasMore, setHasMore] = useState(true);
  const [pictureList, setPictureList] = useState<RESPONSE.Pictrue[]>([]);
  const [menuName, setMenuName] = useState<string>("1");
  useEffect(() => {
    if (!name) return;
    setHasMore(true);
    const getPicture = async () => {
      try {
        const res = await request(
          `/api/picture/user?id=${id}&category=${name}&reviewStatus=${menuName}`
        );
        setPictureList(res.data);
      } catch (e: any) {
        message.error("获取图片失败");
      }
    };
    getPicture();
  }, [menuName, name]);

  const loadMoreData = async (pictureId: number) => {
    if (!hasMore || !name) return;
    try {
      const newData = await request(
        `/api/picture/user?id=${id}&category=${name}&reviewStatus=${menuName}&pictureId=${pictureId}`
      );
      setPictureList((prev) => [...prev, ...newData.data]);
      setHasMore(newData.data.length > 0);
    } catch (error) {
      message.error("加载失败");
    }
  };

  return (
    <div className="user_picture">
      <Space align="start" style={{ width: "100%" }}>
        {isUser && (
          <Menu
            onClick={(value) => {
              setMenuName(value.key);
            }}
            style={{ width: 200 }}
            defaultSelectedKeys={["1"]}
            mode="vertical"
            items={[
              {
                key: "1",
                icon: <CheckCircleOutlined />,
                label: "审核通过",
              },
              {
                key: "0",
                icon: <ClockCircleOutlined />,
                label: "未审核",
              },
              {
                key: "2",
                icon: <CloseCircleOutlined />,
                label: "审核拒绝",
              },
            ]}
          />
        )}
        <div className="picture_list">
          {pictureList && (
            <PictureLayout
              pictureList={pictureList}
              renderItem={(picture) => (
                <Card
                  hoverable
                  style={{ width: 200 }}
                  cover={
                    <Link href={`/picture/${picture.id}`}>
                      <Image
                        alt={picture.name}
                        src={IMAGE_HOST + picture.url}
                        preview={false}
                      />
                    </Link>
                  }
                >
                  <Flex justify="space-around" align="start" vertical={true}>
                    <Typography.Text>{picture.name}</Typography.Text>
                    <div>
                      {picture.tags.map((tag) => (
                        <Link href={`/tags?name=${tag.name}`}>
                          <Tag
                            key={tag.name}
                            bordered={false}
                            color="cyan"
                            style={{ marginTop: 8 }}
                          >
                            {tag.name}
                          </Tag>
                        </Link>
                      ))}
                    </div>
                  </Flex>
                </Card>
              )}
              onLoadMore={loadMoreData}
              hasMore={hasMore}
            />
          )}
        </div>
      </Space>
    </div>
  );
};

export default UserPicture;
