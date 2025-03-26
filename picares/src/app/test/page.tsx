"use client";
import { DebounceSelect } from "@/app/admin/components/DebounceSelect";
import request from "@/libs/request";
import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";

interface TagsValue {
  label: string;
  value: string;
}

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [value, setValue] = useState<TagsValue[]>([]);

  const fetchUserList = async (name: string) => {
    try {
      const res = await request(`/api/tags?name=${name}`);
      return res.data.map((item: any) => ({
        label: item.name,
        value: item.name,
      }));
    } catch (e: any) {
      message.error("获取标签失败");
    }
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      component={false}
    >
      <Form.Item label="原密码" name="password" rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item label="新密码" name="newPassword" rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="确认密码"
        name="confirmPassword"
        validateFirst
        rules={[
          { required: true },
          { type: "email", min: 6, max: 10 },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (getFieldValue("newPassword") !== value) {
                return Promise.reject(new Error("两次输入的密码不一致"));
              }

              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="select"
        name="select"
        validateFirst
        rules={[
          { required: true },
          {
            type: "array",
            max: 4,
            message: "标签数量大于4",
          },
          {
            validator: (_, value) => {
              if (
                value &&
                value.some((item: TagsValue) => item.value.length > 4)
              ) {
                return Promise.reject(new Error("单个标签长度不能超过4字符"));
              }
              return Promise.resolve();
            },
          },
          //我想校验单个标签的长度不要大于4，但是不知道怎么校验
        ]}
      >
        <DebounceSelect
          mode="tags"
          value={value}
          placeholder="请输入"
          fetchOptions={(values) => fetchUserList(values)}
          style={{ width: "100%" }}
          onChange={(newValue) => {
            if (Array.isArray(newValue)) {
              setValue(newValue);
            }
          }}
        />
      </Form.Item>
      <Form.Item style={{ justifySelf: "center" }}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export default App;
