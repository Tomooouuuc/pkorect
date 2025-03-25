import request from "@/libs/request";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
} from "antd";
import React, { useState } from "react";
import { DebounceSelect } from "../../components/DebounceSelect";
import { fetchUserList } from "../utils";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  categoryList: RESPONSE.Categorys[];
}

interface TagsValue {
  label: string;
  value: string;
}

const BatchCreateModal: React.FC<Props> = (props) => {
  const { visible, onCancel, onSubmit, categoryList } = props;
  const [value, setValue] = useState<TagsValue[]>([]);

  return (
    <Modal
      title={"从搜索引擎添加图片"}
      open={visible}
      footer={null}
      onCancel={() => {
        onCancel();
      }}
      destroyOnClose
    >
      <Form
        name="basic"
        layout="vertical"
        style={{ width: "90%", margin: "0 auto" }}
        onFinish={async (values) => {
          const { tags, ...value } = values;
          const tagsList = tags.map((item: any) => {
            return item.value;
          });
          try {
            await request("/api/picture/upload/batch", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              data: { ...value, tagsList },
            });
            message.success("添加成功");
            onSubmit();
          } catch (e: any) {
            message.error("添加失败");
          }
        }}
      >
        <Form.Item
          label="图片关键词"
          name="name"
          rules={[{ required: true, message: "请输入关键词" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="添加数量"
          name="count"
          rules={[{ type: "number", max: 30, message: "最多30张" }]}
        >
          <InputNumber min={1} max={30} />
        </Form.Item>
        <Form.Item
          label="图片目录"
          name="category"
          rules={[{ required: true, message: "请选择目录" }]}
        >
          <Select
            placeholder="请选择"
            allowClear
            options={categoryList.map((item) => {
              return {
                value: item.name,
                label: item.name,
              };
            })}
          />
        </Form.Item>
        <Form.Item
          label="图片标签"
          name="tags"
          rules={[{ required: true, message: "请输入标签" }]}
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
        <Form.Item>
          <Space>
            <Button htmlType="button" onClick={onCancel}>
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BatchCreateModal;
