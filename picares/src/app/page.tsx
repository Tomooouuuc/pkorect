"use client";
import request from "@/libs/request";
import { message, Tabs } from "antd";
import { useEffect, useState } from "react";
import PictureLayout from "./components/PictureLayout";
import "./index.css";

export default function Home() {
  const [categoryList, setCategoryList] = useState<RESPONSE.Categorys[]>([]);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await request("/api/categorys", { method: "GET" });
        setCategoryList(res.data);
      } catch (e: any) {
        message.error("获取分类失败");
      }
    };
    getCategory();
  }, []);
  return (
    <div className="home_page">
      <Tabs
        defaultActiveKey="1"
        tabPosition={"top"}
        style={{ height: 220, justifySelf: "start" }}
        items={categoryList.map((category) => {
          return {
            label: category.name,
            key: category.name,
            children: <PictureLayout name={category.name} />,
          };
        })}
      />
    </div>
  );
}
