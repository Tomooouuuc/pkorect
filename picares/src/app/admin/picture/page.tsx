"use client";
import { IMAGE_HOST } from "@/constant/user";
import request from "@/libs/request";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, message, Select, Tag } from "antd";
import { Image as AntdImage } from "antd/lib";
import { useEffect, useRef, useState } from "react";
import { DebounceSelect } from "../components/DebounceSelect";
import UpdateModal from "./components/UpdateModal";

interface TagsValue {
  label: string;
  value: string;
}

const PictureAdminPage = () => {
  const actionRef = useRef<ActionType>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<RESPONSE.Pictrue>();
  const [categoryList, setCategoryList] = useState<RESPONSE.Categorys[]>([]);
  const [value, setValue] = useState<TagsValue[]>([
    // { label: "艺术", value: "艺术" },
  ]);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await request("/api/categorys");
        setCategoryList(res.data);
      } catch (e: any) {
        message.error("获取分类失败");
      }
    };
    getCategory();
  }, []);

  const doDelete = async (id: number) => {
    try {
      await request(`/api/picture/${id}`, { method: "DELETE" });
      message.success("删除成功");
      actionRef.current?.reload();
    } catch (e: any) {
      message.error("删除失败");
    }
  };

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

  const columns: ProColumns<RESPONSE.Pictrue>[] = [
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
      title: "图片",
      valueType: "image",
      hideInSearch: true,
      hideInForm: true,
      render: (_, record) => {
        return (
          <AntdImage
            src={IMAGE_HOST + record.url}
            alt={""}
            width={44}
            height={44}
          />
        );
      },
    },
    {
      title: "图片名称",
      dataIndex: "name",
      valueType: "text",
    },
    {
      title: "图片简介",
      dataIndex: "introduction",
      valueType: "text",
    },
    {
      title: "图片目录",
      dataIndex: "categoryName",
      valueType: "text",
      render: (_, record) => {
        return <>{record.category.name}</>;
      },
      renderFormItem() {
        return (
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
        );
      },
    },
    {
      title: "图片标签",
      dataIndex: "tagsList",
      valueType: "select",
      render: (_, record) => {
        return (
          <>
            {record.tags.map((item) => {
              return (
                <Tag key={item.name} bordered={false} color="cyan">
                  {item.name}
                </Tag>
              );
            })}
          </>
        );
      },
      renderFormItem() {
        return (
          <DebounceSelect
            mode="multiple"
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
        );
      },
    },
    {
      title: "图片大小",
      dataIndex: "picSize",
      valueType: "text",
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: "图片宽度",
      dataIndex: "picWidth",
      valueType: "text",
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: "图片高度",
      dataIndex: "picHeight",
      valueType: "text",
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: "宽高比例",
      dataIndex: "picScale",
      valueType: "text",
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: "图片格式",
      dataIndex: "picFormat",
      valueType: "text",
      hideInForm: true,
    },
    {
      title: "创建用户",
      valueType: "text",
      hideInForm: true,
      render: (_, record) => {
        return <>{record.user.userAccount}</>;
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
          }}
        >
          编辑
        </Button>,
        <Button
          color="danger"
          variant="filled"
          size="small"
          onClick={() => doDelete(record.id)}
        >
          删除
        </Button>,
      ],
    },
  ];
  return (
    <div id="picture-login-page">
      <PageContainer>
        <ProTable<RESPONSE.Pictrue>
          columns={columns}
          actionRef={actionRef}
          request={async (params, sort, filter) => {
            console.log("params:", params, "value", value);
            const tagsList = value.map((item) => {
              return item.value;
            });
            //这里怎么获取标签数据
            const sortField = Object.keys(sort)?.[0];
            const sortOrder = sort?.[sortField];
            const body = {
              ...params,
              tagsList,
              sortField,
              sortOrder,
              ...filter,
            };
            const { code, data } = (await request("/api/picture/query", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              data: body,
            })) as RESPONSE.Base<RESPONSE.Page<RESPONSE.Pictrue>>;
            console.log("获取到的数据：", data);
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
          columns={columns}
          oldData={currentDate}
          onSubmit={() => {
            setVisible(false);
            setCurrentDate(undefined);
            actionRef.current?.reload();
          }}
          onCancel={() => {
            setVisible(false);
          }}
        />
      </PageContainer>
    </div>
  );
};

export default PictureAdminPage;
