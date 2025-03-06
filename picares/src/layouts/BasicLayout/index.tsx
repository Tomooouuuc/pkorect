"use client";
import { menus } from "@/config/menus";
import {
  GithubFilled,
  InfoCircleFilled,
  LogoutOutlined,
  QuestionCircleFilled,
} from "@ant-design/icons";
import { ProLayout } from "@ant-design/pro-components";
import { Dropdown } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GlobalFooter } from "./components/GlobalFooter";
import "./index.css";

interface Props {
  children: React.ReactNode;
}

const BasicLayout = ({ children }: Props) => {
  const pathname = usePathname();
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
          src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
          size: "small",
          title: "七妮妮",
          render: (props, dom) => {
            return (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "logout",
                      icon: <LogoutOutlined />,
                      label: "退出登录",
                    },
                  ],
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
            <a>
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
          return menus;
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
