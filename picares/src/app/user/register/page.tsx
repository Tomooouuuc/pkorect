"use client";
import request from "@/libs/request";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { LoginForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const UserRegisterPage: React.FC = () => {
  const [form] = ProForm.useForm();
  const router = useRouter();
  const doRegister = async (values: REQUEST.UserRegister) => {
    try {
      const res = await request("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: values,
      });
      message.success("注册成功，请登录");
      form.resetFields();
      router.push("/user/login");
    } catch (e: any) {
      message.error("注册失败，" + e.message);
    }
  };
  return (
    <div id="userRegisterPage">
      <LoginForm
        form={form}
        logo="/assets/logo.jpg"
        title="Picares"
        subTitle="阿瑞斯云图库"
        onFinish={doRegister}
        submitter={{
          searchConfig: {
            submitText: "注册",
          },
        }}
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
        <ProFormText.Password
          name="checkPassword"
          fieldProps={{
            size: "large",
            prefix: <LockOutlined className={"prefixIcon"} />,
          }}
          placeholder={"请确认密码"}
          rules={[
            {
              required: true,
              message: "请确认密码！",
            },
          ]}
        />
        <div
          style={{
            marginBlockEnd: 24,
            textAlign: "end",
          }}
        >
          <Link href={"/user/login"}>返回登录</Link>
        </div>
      </LoginForm>
    </div>
  );
};

export default UserRegisterPage;
