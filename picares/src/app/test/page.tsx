"use client";
import request from "@/libs/request";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import type { GetProp, UploadProps } from "antd";
import { Button, Form, Input, message, Select, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { DebounceSelect } from "../admin/components/DebounceSelect";

interface TagsValue {
  label: string;
  value: string;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [file, setFile] = useState(null);
  const [categoryList, setCategoryList] = useState<RESPONSE.Categorys[]>([]);
  const [value, setValue] = useState<TagsValue[]>([]);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await request("/api/categorys", { method: "GET" });
        setCategoryList(res.data);
      } catch (e: any) {
        message.error("获取图片分类失败");
      }
    };
    getCategory();
  }, []);

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

  const handleChange: UploadProps["onChange"] = (info: any) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      setFile(info.file.originFileObj);
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const onFinish = async (values: any) => {
    console.log("values:", values);
    const formData = new FormData();
    if (!file) {
      message.error("请上传图片");
      return;
    }
    formData.append("image", file);

    Object.keys(values).forEach((key) => {
      if (key === "tags") {
        const tagsValue = values.tags.map((tag: any) => tag.value);
        console.log("tagsValue:", tagsValue);
        formData.append(key, tagsValue);
      } else {
        formData.append(key, values[key]);
      }
    });
    console.log("formData:", formData);
    try {
      await request("/api/picture/upload", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      message.success("上传成功");
      setFile(null);
      setImageUrl("");
    } catch (e: any) {
      message.error("上传失败，" + e.message);
    }
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item label="上传图片">
        <Upload
          name="image"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="image" style={{ width: "100%" }} />
          ) : (
            uploadButton
          )}
        </Upload>
      </Form.Item>
      <Form.Item label="图片名称" name="name">
        <Input />
      </Form.Item>
      <Form.Item label="图片简介" name="introduction">
        <Input />
      </Form.Item>
      <Form.Item label="图片目录" name="category">
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
      <Form.Item label="图片标签" name="tags">
        <DebounceSelect
          mode="tags"
          value={value}
          placeholder="请输入"
          fetchOptions={(values) => fetchUserList(values)}
          style={{ width: "100%" }}
          onChange={(newValue) => {
            if (Array.isArray(newValue)) {
              console.log("newValue:", newValue);
              setValue(newValue);
            }
          }}
        />
      </Form.Item>
      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default App;
