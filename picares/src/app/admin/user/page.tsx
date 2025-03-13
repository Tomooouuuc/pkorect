"use client";
import { roleLevels, UserRole } from "@/config/userRole";
import { IMAGE_HOST } from "@/constant/user";
import request from "@/libs/request";
import { LoadingOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import {
  Button,
  GetProp,
  message,
  Select,
  Tag,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import ImgCrop from "antd-img-crop";
import { Image as AntdImage } from "antd/lib";
import { useRef, useState } from "react";
import UpdateModal from "./components/UpdateModal";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const levelColors: Record<UserRole, string> = {
  admin: "gold",
  user: "success",
  "": "default",
};

const UserAdminPage = () => {
  const actionRef = useRef<ActionType>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<RESPONSE.User>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const handleChange = (info: any) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      setFile(info.file.originFileObj);
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const doDelete = async (id: number) => {
    try {
      await request(`/api/user/${id}`, {
        method: "DELETE",
      });
      message.success("删除成功");
      actionRef.current?.reload();
    } catch (e: any) {
      message.error("删除失败");
    }
  };

  const doSubmit = async (
    values: RESPONSE.User,
    id: number,
    userAccount: string
  ) => {
    const formData = new FormData();
    if (file) {
      formData.append("avatar", file);
    }
    Object.keys(values).forEach((key) => {
      if (key !== "userAvatar") {
        formData.append(key, values[key]);
      }
    });
    formData.append("userAccount", userAccount);
    try {
      await request(`/api/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      message.success("更新成功");
      setVisible(false);
      setFile(null);
      setImageUrl("");
      actionRef.current?.reload();
    } catch (e: any) {
      message.error("更新失败，" + e.message);
    }
  };

  const columns: ProColumns<RESPONSE.User>[] = [
    {
      title: "id",
      dataIndex: "id",
      valueType: "text",
      hideInSearch: true,
      hideInTable: true,
      hideInForm: true,
      width: 48,
    },
    {
      title: "账号",
      dataIndex: "userAccount",
      valueType: "text",
      hideInForm: true,
    },
    {
      title: "名称",
      dataIndex: "userName",
      valueType: "text",
    },
    {
      title: "头像",
      dataIndex: "userAvatar",
      valueType: "image",
      hideInSearch: true,
      render: (_, record) => {
        return (
          <AntdImage
            src={
              record.userAvatar
                ? IMAGE_HOST + record.userAvatar
                : "/assets/notLoginUser.png"
            }
            alt={""}
            width={44}
            height={44}
          />
        );
      },
      renderFormItem: () => {
        return (
          <ImgCrop>
            <Upload
              listType="picture-card"
              showUploadList={false}
              onChange={handleChange}
              onPreview={onPreview}
            >
              {loading ? (
                <LoadingOutlined />
              ) : (
                <AntdImage
                  src={imageUrl}
                  alt="avatar"
                  style={{ width: "100%" }}
                  preview={false}
                />
              )}
            </Upload>
          </ImgCrop>
        );
      },
    },
    {
      title: "简介",
      dataIndex: "userProfile",
      valueType: "text",
    },
    {
      title: "权限",
      dataIndex: "userRole",
      valueType: "select",
      valueEnum: Object.fromEntries(
        Object.entries(roleLevels).map((userRole) => [
          userRole,
          { text: userRole },
        ])
      ),
      renderFormItem: () => {
        return (
          <Select
            // 我希望加一个默认值，作用是查询
            options={Object.entries(roleLevels).map(([userRole, level]) => ({
              value: userRole,
              label: userRole,
            }))}
          />
        );
      },
      render: (_, record) => {
        const userRole = record.userRole as UserRole;
        const color = levelColors[userRole] || "default";
        return (
          <Tag bordered={false} color={color}>
            {record.userRole}
          </Tag>
        );
      },
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      valueType: "dateTime",
      sorter: true,
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: "操作",
      valueType: "option",
      key: "option",
      render: (text, record, _, action) => [
        <Button
          color="cyan"
          variant="filled"
          size="small"
          onClick={() => {
            setVisible(true);
            setCurrentDate(record);
            if (record.userAvatar) {
              setImageUrl(
                record.userAvatar
                  ? IMAGE_HOST + record.userAvatar
                  : "/assets/notLoginUser.png"
              );
            } else {
              setImageUrl("/assets/notLoginUser.png");
            }
          }}
        >
          编辑
        </Button>,
        <Button
          color="danger"
          variant="filled"
          size="small"
          onClick={() => doDelete(record?.id)}
        >
          删除
        </Button>,
      ],
    },
  ];
  return (
    <div id="user-login-page">
      <PageContainer>
        <ProTable<RESPONSE.User>
          columns={columns}
          actionRef={actionRef}
          request={async (params, sort, filter) => {
            const sortField = Object.keys(sort)?.[0];
            const sortOrder = sort?.[sortField];
            //这里没有拿到权限的值
            const body = {
              ...params,
              sortField,
              sortOrder,
              ...filter,
            };
            const { code, data } = (await request("/api/user/query", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              data: body,
            })) as RESPONSE.Base<RESPONSE.Page<RESPONSE.User>>;
            return {
              success: code === 0,
              data: data?.records || [],
              total: data?.total || 0,
            };
          }}
          rowKey="id"
          search={{
            span: 6,
            defaultCollapsed: false,
            labelWidth: "auto",
          }}
          options={{
            setting: false,
            density: false,
          }}
          pagination={{
            pageSize: 10,
          }}
        />
        <UpdateModal
          visible={visible}
          onCancel={() => {
            setVisible(false);
            setImageUrl("");
          }}
          columns={columns}
          oldData={currentDate}
          onSubmit={doSubmit}
        />
      </PageContainer>
    </div>
  );
};

export default UserAdminPage;
