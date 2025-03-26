"use client";
import request from "@/libs/request";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Menu,
  message,
  Select,
  SelectProps,
  Space,
  Upload,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import "./index.css";

const options: SelectProps["options"] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    label: i.toString(36) + i,
    value: i.toString(36) + i,
  });
}

const UserSettingPage = () => {
  const session = useSession();
  const userId = session.data?.user?.id;
  const [user, setUser] = useState<RESPONSE.User>();
  const [key, setKey] = useState<string>("1");
  const [form] = Form.useForm();

  useEffect(() => {
    if (!userId) return;
    const getUser = async () => {
      try {
        const res = await request(`/api/user?userId=${userId}`, {
          method: "GET",
        });
        setUser(res.data);
        form.setFieldsValue({
          userAccount: res.data.userAccount,
          userName: res.data.userName,
        });
        console.log("获取的user:", res.data);
      } catch (e: any) {
        message.error("获取用户信息失败");
      }
    };
    getUser();
  }, [userId]);

  return (
    <div id="user_setting_page">
      <Card style={{ width: "60%", height: 500, margin: "0 auto" }}>
        <Space align="start">
          <Menu
            onClick={(value) => {
              setKey(value.key);
            }}
            style={{ width: 200 }}
            defaultSelectedKeys={["1"]}
            mode="vertical"
            items={[
              {
                key: "1",
                label: "个人信息",
              },
              {
                key: "2",
                label: "修改密码",
              },
            ]}
          />
          {key === "1" && (
            <Form
              form={form}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
            >
              <Form.Item label="账号" name="userAccount">
                {user?.userAccount}
              </Form.Item>

              <Form.Item label="个人头像" valuePropName="fileList">
                <Upload action="/upload.do" listType="picture-card">
                  <button
                    style={{
                      color: "inherit",
                      cursor: "inherit",
                      border: 0,
                      background: "none",
                    }}
                    type="button"
                  >
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </button>
                </Upload>
              </Form.Item>
              <Form.Item label="个人名称" name="userName">
                <Input />
              </Form.Item>
              <Form.Item label="个人简介">
                <TextArea rows={3} />
              </Form.Item>
              <Form.Item label="创建时间">{user?.createTime}</Form.Item>
              <Form.Item style={{ justifySelf: "center" }}>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Form>
          )}
          {key === "2" && (
            <Form
              form={form}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              component={false}
            >
              <Form.Item
                label="原密码"
                name="password"
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="新密码"
                name="newPassword"
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="确认密码"
                name="confirmPassword"
                // hasFeedback
                // validateStatus="error"
                // dependencies={["newPassword"]}
                validateFirst
                rules={[
                  { required: true },
                  { type: "email", min: 6, max: 10 },
                  //   ({ getFieldValue }) => ({
                  //     validator(_, value) {
                  //       if (getFieldValue("newPassword") !== value) {
                  //         return Promise.reject(
                  //           new Error("两次输入的密码不一致")
                  //         );
                  //       }

                  //       return Promise.resolve();
                  //     },
                  //   }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="aaaa"
                name="age"
                rules={[
                  {
                    required: true,
                    type: "number",
                    transform: (value) => Number(value), // 类型转换
                    message: "必须为数字",
                  },
                ]}
              >
                <Input placeholder="输入数字" />
              </Form.Item>
              <Form.Item
                label="select"
                name="select"
                rules={[
                  {
                    type: "string",
                    max: 4,
                    message: "长度大于3",
                  },
                  //   {
                  //     type: "array",
                  //     max: 3,
                  //     message: "数量大于3",
                  //   },
                ]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  defaultValue={["a10", "c12"]}
                  options={options}
                />
              </Form.Item>
              <Form.Item style={{ justifySelf: "center" }}>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Form>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default UserSettingPage;
