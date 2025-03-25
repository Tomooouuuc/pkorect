"use client";
import { IMAGE_HOST } from "@/constant/user";
import request from "@/libs/request";
import { Card, Flex, Image, message, Tabs, Tag, Typography } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import PictureLayout from "./components/PictureLayout";
import "./index.css";

export default function Home() {
  const [categoryList, setCategoryList] = useState<RESPONSE.Categorys[]>([]);
  const [pictureList, setPictureList] = useState<RESPONSE.Pictrue[]>([]);
  const [name, setName] = useState<string>("全部");
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await request("/api/categorys", { method: "GET" });
        setCategoryList([{ name: "全部" }, ...res.data]);
      } catch (e: any) {
        message.error("获取目录失败");
      }
    };
    getCategory();
  }, []);

  useEffect(() => {
    async function getPicture() {
      if (!name) return;
      var categoryName = name;
      if (name === "全部") {
        categoryName = "";
      }
      try {
        const res = await request(`/api/picture?category=${categoryName}`);
        setPictureList(res.data);
      } catch (e: any) {
        message.error("获取图片列表失败");
      }
    }
    getPicture();
  }, [name]);

  const loadMoreData = async (id: number) => {
    if (!hasMore) return;
    var categoryName = name;
    if (name === "全部") {
      categoryName = "";
    }
    try {
      const newData = await request(
        `/api/picture?category=${categoryName}&id=${id}`
      );
      setPictureList((prev) => [...prev, ...newData.data]);
      console.log("hasMore", newData.data.length > 0);
      setHasMore(newData.data.length > 0);
    } catch (error) {
      message.error("加载失败");
    }
  };
  return (
    <div className="home_page">
      <Tabs
        defaultActiveKey="1"
        tabPosition={"top"}
        onTabClick={(name) => {
          setName(name);
          setHasMore(true);
        }}
        style={{ justifySelf: "start", width: "100%" }}
        items={categoryList.map((category) => {
          return {
            label: category.name,
            key: category.name,
            children: (
              <PictureLayout
                pictureList={pictureList}
                renderItem={(picture) => (
                  <Card
                    key={picture.id}
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
            ),
          };
        })}
      />
    </div>
  );
}
