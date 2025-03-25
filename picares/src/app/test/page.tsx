"use client";
import request from "@/libs/request";
import { Button } from "antd";
import React, { useEffect, useState } from "react";

const App: React.FC = () => {
  const [name, setName] = useState<string>("1");
  const test = async () => {
    try {
      await request(`/api/aaaaa?category=aaa&id=2`);
    } catch (error) {
      console.log("加载失败");
    }
  };
  // 我已经关闭了react的严格模式。
  //请解释一下为什么当初次进入页面时，test函数会执行4次
  //请不要给我任何优化建议。我只是想学习react的渲染机制。
  test();
  useEffect(() => {
    setName("2");
  }, []);

  return <Button>aaa</Button>;
};

export default App;
