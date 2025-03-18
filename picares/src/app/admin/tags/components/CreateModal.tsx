import request from "@/libs/request";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { message, Modal } from "antd";
import React from "react";

interface Props {
  visible: boolean;
  onCancel: () => void;
  columns: ProColumns<RESPONSE.Categorys>[];
  onSubmit: () => void;
}

const CreateModal: React.FC<Props> = (props) => {
  const { visible, onCancel, columns, onSubmit } = props;
  return (
    <Modal
      title={"新建标签"}
      footer={null}
      open={visible}
      onCancel={onCancel}
      destroyOnClose
    >
      <ProTable
        type={"form"}
        columns={columns}
        onSubmit={async (values: RESPONSE.User) => {
          try {
            await request(`/api/tags`, {
              method: "POST",
              data: values,
            });
            message.success("创建成功");
            onSubmit();
          } catch (e: any) {
            message.error("创建失败");
          }
        }}
      />
    </Modal>
  );
};

export default CreateModal;
