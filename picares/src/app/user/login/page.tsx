"use client";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { LoginForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { message } from "antd";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const UserLoginPage: React.FC = () => {
  const [form] = ProForm.useForm();
  const router = useRouter();

  const doLogin = async (values: REQUEST.UserLogin) => {
    const res = await signIn("credentials", {
      redirect: false,
      userAccount: values.userAccount,
      userPassword: values.userPassword,
    });
    if (res?.error) {
      message.error("登录失败，" + res.error);
    } else {
      message.success("登录成功");
      router.replace("/");
      form.resetFields();
    }
  };
  return (
    <div id="userLoginPage">
      <LoginForm
        logo="/assets/logo.jpg"
        title="Picares"
        subTitle="阿瑞斯云图库"
        onFinish={doLogin}
        form={form}
      >
        <ProFormText
          name="userAccount"
          fieldProps={{
            size: "large",
            prefix: <UserOutlined className={"prefixIcon"} />,
          }}
          placeholder={"请输入账号"}
          rules={[
            {
              required: true,
              message: "请输入账号!",
            },
          ]}
        />
        <ProFormText.Password
          name="userPassword"
          fieldProps={{
            size: "large",
            prefix: <LockOutlined className={"prefixIcon"} />,
          }}
          placeholder={"请输入密码"}
          rules={[
            {
              required: true,
              message: "请输入密码！",
            },
          ]}
        />
        <div
          style={{
            marginBlockEnd: 24,
            textAlign: "end",
          }}
        >
          <Link href={"/user/register"}>注册账号</Link>
        </div>
      </LoginForm>
    </div>
  );
};

export default UserLoginPage;
