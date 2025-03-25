"use client";
import PictureLayout from "@/app/components/PictureLayout";
import { IMAGE_HOST } from "@/constant/user";
import request from "@/libs/request";
import { LoadingOutlined } from "@ant-design/icons";
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
  useEffect(() => {}, []);
  const [currentPicture, setCurrentPicture] = useState<RESPONSE.Pictrue[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [pictureList, setPictureList] = useState<RESPONSE.Pictrue[]>([]);
  const [menuName, setMenuName] = useState<number>(1);

  useEffect(() => {
    if (!name) return;
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
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const newData = await request(
        `/api/picture/user?id=${id}&category=${name}&reviewStatus=${menuName}&pictureId=${pictureId}`
      );
      setPictureList((prev) => [...prev, ...newData.data]);
      setHasMore(newData.data.length > 0);
    } catch (error) {
      message.error("加载失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user_picture">
      <Space align="start" style={{ width: "100%" }}>
        {isUser && (
          <Menu
            onClick={(value) => {
              const key = value.key as unknown as number;
              setMenuName(key);
            }}
            style={{ width: 200 }}
            defaultSelectedKeys={["1"]}
            mode="vertical"
            items={[
              {
                key: "1",
                icon: <LoadingOutlined />,
                label: "审核通过",
              },
              {
                key: "0",
                icon: <LoadingOutlined />,
                label: "未审核",
              },
              {
                key: "2",
                icon: <LoadingOutlined />,
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
              isLoading={isLoading}
            />
          )}
        </div>
      </Space>
    </div>
  );
};

export default UserPicture;
