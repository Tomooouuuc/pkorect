"use client";
import { getAccessMenus } from "@/config/menus";
import { IMAGE_HOST } from "@/constant/user";
import {
  GithubFilled,
  InfoCircleFilled,
  LogoutOutlined,
  QuestionCircleFilled,
} from "@ant-design/icons";
import { ProLayout } from "@ant-design/pro-components";
import { Dropdown, message } from "antd";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { GlobalFooter } from "./components/GlobalFooter";
import "./index.css";

interface Props {
  children: React.ReactNode;
}

const BasicLayout = ({ children }: Props) => {
  const pathname = usePathname();
  const session = useSession();
  const user = session.data?.user;
  const userRole = user?.userRole;
  const router = useRouter();
  const doLogout = async () => {
    try {
      await signOut();
      message.success("已退出登录");
      router.replace("/user/login");
    } catch (e: any) {
      message.error("操作失败");
    }
  };
  return (
    <div
      id="basicLayout"
      style={{
        height: "100vh",
        overflow: "auto",
      }}
    >
      <ProLayout
        layout="top"
        title="Picares"
        logo={
          <Image
            src={"/assets/logo.jpg"}
            alt="picares"
            width={32}
            height={32}
          />
        }
        location={{
          pathname,
        }}
        avatarProps={{
          src: user?.userAvatar
            ? IMAGE_HOST + user.userAvatar
            : "/assets/notLoginUser.png",
          size: "small",
          title: user?.userName ?? "未登录",
          render: (props, dom) => {
            return (
              <Dropdown
                menu={{
                  items: userRole
                    ? [
                        {
                          key: "logout",
                          icon: <LogoutOutlined />,
                          label: "退出登录",
                        },
                      ]
                    : [],
                  onClick: async (event: { key: React.Key }) => {
                    const { key } = event;
                    if (key === "logout") {
                      await doLogout();
                    }
                  },
                }}
              >
                {dom}
              </Dropdown>
            );
          },
        }}
        actionsRender={(props) => {
          if (props.isMobile) return [];
          return [
            <InfoCircleFilled key="InfoCircleFilled" />,
            <QuestionCircleFilled key="QuestionCircleFilled" />,
            <GithubFilled key="GithubFilled" />,
          ];
        }}
        headerTitleRender={(logo, title, _) => {
          const defaultDom = (
            <a href="/">
              {logo}
              {title}
            </a>
          );
          return <>{defaultDom}</>;
        }}
        footerRender={() => {
          return <GlobalFooter />;
        }}
        menuDataRender={() => {
          return getAccessMenus(userRole);
        }}
        menuItemRender={(item, dom) => (
          <Link href={item.path || "/"} target={item.target}>
            {dom}
          </Link>
        )}
      >
        {children}
      </ProLayout>
    </div>
  );
};

export default BasicLayout;
