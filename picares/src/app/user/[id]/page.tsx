"use client";
import { IMAGE_HOST } from "@/constant/user";
import request from "@/libs/request";
import { IdcardOutlined } from "@ant-design/icons";
import { Avatar, Card, message, Space, Tabs, Tag, Typography } from "antd";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import UserPicture from "./components";

const UserPage = () => {
  const { id } = useParams<{ id: string }>();
  const session = useSession();

  const [categoryList, setCategoryList] = useState<RESPONSE.Categorys[]>([]);
  const [name, setName] = useState("");
  const [currentUser, setCurrentUser] = useState<RESPONSE.User>();
  const userId = session.data?.user?.id.toString();

  const isUser = userId === id;

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await request(`/api/user/${id}`, { method: "GET" });
        setCurrentUser(res.data);
      } catch (e: any) {
        message.error("获取用户失败");
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await request("/api/categorys", { method: "GET" });
        setCategoryList(res.data);
        setName(res.data[0].name);
      } catch (e: any) {
        message.error("获取目录失败");
      }
    };
    getCategory();
  }, []);

  return (
    <div className="user_page">
      <Card style={{ height: 180 }}>
        {isUser && (
          <div>
            <Space>
              <div style={{ paddingLeft: "16px" }}>
                <IdcardOutlined />
              </div>
              {currentUser?.userAccount}
              <div style={{ paddingLeft: "32px" }}>
                {currentUser?.userRole === "admin" ? (
                  <Tag bordered={false} color={"gold"}>
                    {currentUser?.userRole}
                  </Tag>
                ) : (
                  <Tag bordered={false} color={"success"}>
                    {currentUser?.userRole}
                  </Tag>
                )}
              </div>
            </Space>
          </div>
        )}
        <div style={{ position: "absolute", bottom: 0, padding: "16px" }}>
          <Space>
            <Avatar
              size={80}
              src={
                currentUser?.userAvatar
                  ? IMAGE_HOST + currentUser.userAvatar
                  : "/assets/notLoginUser.png"
              }
            />
            <Space direction="vertical">
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                {currentUser?.userName}
              </Typography.Title>
              <Typography.Paragraph>
                {currentUser?.userProfile}
              </Typography.Paragraph>
            </Space>
          </Space>
        </div>
      </Card>
      <Card>
        <Tabs
          defaultActiveKey="1"
          tabPosition={"top"}
          onTabClick={(name) => {
            setName(name);
          }}
          style={{ justifySelf: "start", width: "100%" }}
          items={categoryList.map((category) => {
            return {
              label: category.name,
              key: category.name,
              children: <UserPicture isUser={isUser} name={name} id={id} />,
            };
          })}
        />
      </Card>
    </div>
  );
};

export default UserPage;
