import request from "@/libs/request";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { message, Modal } from "antd";
import React from "react";

interface Props {
  visible: boolean;
  onCancel: () => void;
  columns: ProColumns<RESPONSE.Pictrue>[];
  oldData?: RESPONSE.Pictrue;
  onSubmit: () => void;
}

const UpdateModal: React.FC<Props> = (props) => {
  const { visible, onCancel, columns, oldData, onSubmit } = props;
  return (
    <Modal
      title={"更新图片"}
      footer={null}
      open={visible}
      onCancel={onCancel}
      destroyOnClose
    >
      <ProTable
        type={"form"}
        columns={columns}
        form={{
          initialValues: {
            ...oldData,
            categoryName: oldData?.category.name,
            tagsList: oldData?.tags,
          },
        }}
        onSubmit={async (values: RESPONSE.Pictrue) => {
          console.log("提交的数据：", values);
          console.log("旧数据：", oldData);
          try {
            await request(`/api/picture/${oldData?.id}`, {
              method: "PUT",
              data: values,
            });
            message.success("更新成功");
            onSubmit();
          } catch (e: any) {
            message.error("更新失败");
          }
        }}
      />
    </Modal>
  );
};

export default UpdateModal;
