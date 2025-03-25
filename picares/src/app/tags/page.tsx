"use client";
import { IMAGE_HOST } from "@/constant/user";
import request from "@/libs/request";
import { Card, Flex, Image, message, Tag, Typography } from "antd";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PictureLayout from "../components/PictureLayout";

const TagsPage = () => {
  const name = useSearchParams().get("name");
  const [pictureList, setPictureList] = useState<RESPONSE.Pictrue[]>([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const getPicture = async () => {
      try {
        const res = await request(`/api/tags/picture?name=${name}`);
        setPictureList(res.data);
      } catch (e: any) {
        message.error("获取图片失败");
      }
    };
    getPicture();
  }, []);

  const loadMoreData = async (id: number) => {
    if (!hasMore) return;
    try {
      const newData = await request(`/api/tags/picture?name=${name}&id=${id}`);
      setPictureList((prev) => [...prev, ...newData.data]);
      setHasMore(newData.data.length > 0);
    } catch (error) {
      message.error("加载失败");
    }
  };

  return (
    <div className="tags_page">
      <Typography.Title keyboard>{name}</Typography.Title>
      <PictureLayout
        pictureList={pictureList}
        renderItem={(picture) => (
          <Card
            hoverable
            style={{ width: 200 }}
            cover={
              <Link href={`/picture/${picture.id}`}>
                <Image
                  alt="example"
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
    </div>
  );
};

export default TagsPage;
