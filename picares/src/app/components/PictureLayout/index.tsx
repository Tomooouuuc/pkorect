"use client";

import { IMAGE_HOST } from "@/constant/user";
import request from "@/libs/request";
import { Card, Flex, message, Tag, Typography } from "antd";
import { useEffect, useRef, useState } from "react";

interface Props {
  name: string;
}

const PictureLayout: React.FC<Props> = (props) => {
  const { name } = props;
  const [pictureList, setPictureList] = useState<RESPONSE.Pictrue[]>([]);

  const [cols, setCols] = useState(6);
  const [colList, setColList] = useState(
    Array.from({ length: cols }, () => new Array<RESPONSE.Pictrue>())
  );

  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const updateCols = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const newCols = Math.max(1, Math.floor(containerWidth / 200));
      setCols(newCols);
    };

    const observer = new ResizeObserver(updateCols);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    updateCols();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const getColList = () => {
      const tmpColList = Array.from(
        { length: cols },
        () => new Array<RESPONSE.Pictrue>()
      );
      const heights = new Array(cols).fill(0);
      pictureList.forEach((picture) => {
        var minIndex = 0;
        for (var i = 0; i < heights.length; i++) {
          if (heights[i] < heights[minIndex]) {
            minIndex = i;
          }
        }
        tmpColList[minIndex].push(picture);
        heights[minIndex] += 1.0 / picture.picScale;
      });
      console.log("tmpColList:", tmpColList);
      setColList(tmpColList);
    };
    getColList();
    const testList = () => {
      colList.map((col, index) => {
        console.log("col:", col, index);
      });
    };
    testList();
  }, [cols, pictureList]);

  return (
    <div
      ref={containerRef}
      className="picture_layout"
      style={{ width: "100%", display: "flex", gap: "16px" }}
    >
      {colList.map((col, index) => (
        <div
          key={index}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {col.map((picture) => (
            <Card
              hoverable
              style={{ width: 200 }}
              cover={<img alt="example" src={IMAGE_HOST + picture.url} />}
            >
              <Flex justify="space-around" align="start" vertical={true}>
                <Typography.Text>{picture.name}</Typography.Text>
                <div>
                  {picture.tags.map((tag) => (
                    <Tag
                      key={tag.name}
                      bordered={false}
                      color="cyan"
                      style={{ marginTop: 8 }}
                    >
                      {tag.name}
                    </Tag>
                  ))}
                </div>
              </Flex>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PictureLayout;
