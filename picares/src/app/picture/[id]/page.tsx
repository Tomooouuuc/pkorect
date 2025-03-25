"use client";
import { IMAGE_HOST } from "@/constant/user";
import request from "@/libs/request";
import { downloadImage, formatSize } from "@/utils/pictureUtils";
import { DownloadOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Image,
  message,
  Row,
  Space,
  Tag,
} from "antd";
import Link from "antd/es/typography/Link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./index.css";

const PicturePage = () => {
  const { id } = useParams<{ id: string }>();
  const [picture, setPicture] = useState<RESPONSE.Pictrue>();

  useEffect(() => {
    const getPicture = async () => {
      try {
        const res = await request(`/api/picture/${id}`, { method: "GET" });
        setPicture(res.data);
      } catch (e: any) {
        message.error("获取图片失败");
      }
    };
    getPicture();
  }, []);
  return (
    <div className="picture_page">
      <Row gutter={[16, 16]}>
        <Col
          xs={24}
          sm={18}
          md={16}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Card
            className="picture_card"
            hoverable
            style={{ width: "100%", maxWidth: 600 }}
            cover={
              <Image alt={picture?.name} src={IMAGE_HOST + picture?.url} />
            }
          />
        </Col>
        <Col xs={24} sm={6} md={8}>
          <Card hoverable>
            <Space wrap>
              <Descriptions column={1}>
                <Descriptions.Item label="作者">
                  <Link
                    href={`/user/${picture?.user.id}`}
                    style={{ display: "inline-block" }}
                  >
                    <Space>
                      <Avatar
                        src={
                          picture?.user.userAvatar
                            ? IMAGE_HOST + picture?.user.userAvatar
                            : "/assets/notLoginUser.png"
                        }
                      />
                      <div>{picture?.user.userName}</div>{" "}
                    </Space>
                  </Link>
                </Descriptions.Item>
                <Descriptions.Item label="图片名称">
                  {picture?.name}
                </Descriptions.Item>
                <Descriptions.Item label="图片简介">
                  {picture?.introduction}
                </Descriptions.Item>
                <Descriptions.Item label="图片目录">
                  {picture?.category.name}
                </Descriptions.Item>
                <Descriptions.Item label="图片标签">
                  {picture?.tags.map((tag) => (
                    <Link href={`/tags?name=${tag.name}`}>
                      <Tag key={tag.name} bordered={false} color="cyan">
                        {tag.name}
                      </Tag>
                    </Link>
                  ))}
                </Descriptions.Item>
                <Descriptions.Item label="图片大小">
                  {formatSize(picture?.picSize)}
                </Descriptions.Item>
                <Descriptions.Item label="图片规格">
                  {picture?.picWidth} × {picture?.picHeight}
                </Descriptions.Item>
                <Descriptions.Item label="图片宽高比">
                  {picture?.picScale.toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="图片类型">
                  {picture?.picFormat}
                </Descriptions.Item>
              </Descriptions>{" "}
              <Button
                icon={<DownloadOutlined />}
                variant="filled"
                color="pink"
                onClick={() => {
                  const suffix = picture?.url.split(".")[1];
                  downloadImage(
                    IMAGE_HOST + picture?.url,
                    picture?.name! + "." + suffix
                  );
                }}
              >
                下载图片
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PicturePage;
