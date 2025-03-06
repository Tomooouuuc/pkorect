"use client";
import request from "@/libs/request";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import { useRef } from "react";

const UserAdminPage = () => {
  const actionRef = useRef<ActionType>(null);

  const columns: ProColumns<RESPONSE.User>[] = [
    {
      title: "id",
      dataIndex: "id",
      valueType: "text",
      hideInSearch: true,
      hideInTable: true,
      width: 48,
    },
    {
      title: "账号",
      dataIndex: "userAccount",
      valueType: "text",
    },
    {
      title: "名称",
      dataIndex: "userName",
      valueType: "text",
    },
    {
      title: "头像",
      dataIndex: "userAvatar",
      valueType: "text",
      hideInSearch: true,
    },
    {
      title: "简介",
      dataIndex: "userProfile",
      valueType: "text",
    },
    {
      title: "权限",
      dataIndex: "userRole",
      valueType: "text",
      //   valueEnum: {
      //     user: {
      //       text: "用户",
      //     },
      //     admin: {
      //       text: "管理员",
      //     },
      //   },
      //   render: (_, record) => {
      //     if (record.userRole === USER_ACCESS.USER) {
      //       return (
      //         <Tag bordered={false} color="success">
      //           用户
      //         </Tag>
      //       );
      //     }
      //     return (
      //       <Tag bordered={false} color="gold">
      //         管理员
      //       </Tag>
      //     );
      //   },
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      valueType: "dateTime",
      sorter: true,
      hideInSearch: true,
    },
    {
      title: "操作",
      valueType: "option",
      key: "option",
      render: (text, record, _, action) => [
        <Button color="cyan" variant="filled" size="small">
          编辑
        </Button>,
        <Button color="danger" variant="filled" size="small">
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
            const body = {
              ...params,
              sortField,
              sortOrder,
              ...filter,
            };
            const { code, data } = (await request("/api/get/user", {
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
      </PageContainer>
    </div>
  );
};

export default UserAdminPage;
