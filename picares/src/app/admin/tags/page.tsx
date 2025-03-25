"use client";
import request from "@/libs/request";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, message } from "antd";
import { useRef, useState } from "react";
import CreateModal from "./components/CreateModal";
import UpdateModal from "./components/UpdateModal";

const TagsAdminPage = () => {
  const actionRef = useRef<ActionType>(null);
  const [updateVisible, setUpdateVisible] = useState<boolean>(false);
  const [createVisible, setCreateVisible] = useState<boolean>(false);

  const [currentDate, setCurrentDate] = useState<RESPONSE.Categorys>();

  const doDelete = async (id: number) => {
    try {
      await request(`/api/tags/${id}`, { method: "DELETE" });
      message.success("删除成功");
      actionRef.current?.reload();
    } catch (e: any) {
      message.error("删除失败");
    }
  };

  const columns: ProColumns<RESPONSE.Categorys>[] = [
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
      title: "标签名称",
      dataIndex: "name",
      valueType: "text",
    },
    {
      title: "图片数量",
      dataIndex: "pictureCount",
      valueType: "text",
      hideInSearch: true,
      hideInForm: true,
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
            setUpdateVisible(true);
            setCurrentDate(record);
          }}
        >
          编辑
        </Button>,
        <Button
          color="danger"
          variant="filled"
          size="small"
          onClick={() => {
            doDelete(record.id);
          }}
        >
          删除
        </Button>,
      ],
    },
  ];
  return (
    <div id="categorys-login-page">
      <PageContainer>
        <ProTable<RESPONSE.Categorys>
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
            const { code, data } = (await request("/api/tags/query", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              data: body,
            })) as RESPONSE.Base<RESPONSE.Page<RESPONSE.Categorys>>;
            return {
              success: code === 0,
              data: data?.rows || [],
              total: data?.count || 0,
            };
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setCreateVisible(true);
              }}
            >
              <PlusOutlined /> 新建
            </Button>,
          ]}
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
          columns={columns}
          visible={updateVisible}
          oldData={currentDate}
          onCancel={() => {
            setUpdateVisible(false);
          }}
          onSubmit={() => {
            setUpdateVisible(false);
            setCurrentDate(undefined);
            actionRef.current?.reload();
          }}
        />
        <CreateModal
          columns={columns}
          visible={createVisible}
          onCancel={() => {
            setCreateVisible(false);
          }}
          onSubmit={() => {
            setCreateVisible(false);
            actionRef.current?.reload();
          }}
        />
      </PageContainer>
    </div>
  );
};

export default TagsAdminPage;
