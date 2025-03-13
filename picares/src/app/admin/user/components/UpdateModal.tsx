import { ProColumns, ProTable } from "@ant-design/pro-components";
import { Modal } from "antd";
import React from "react";

interface Props {
  visible: boolean;
  onCancel: () => void;
  columns: ProColumns<RESPONSE.User>[];
  oldData?: RESPONSE.User;
  onSubmit: (values: RESPONSE.User, id: number, userAccount: string) => void;
}

const UpdateModal: React.FC<Props> = (props) => {
  const { visible, onCancel, columns, oldData, onSubmit } = props;
  return (
    <Modal
      title={"更新用户"}
      footer={null}
      open={visible}
      onCancel={onCancel}
      destroyOnClose
    >
      <ProTable
        type={"form"}
        columns={columns}
        form={{
          initialValues: oldData,
        }}
        onSubmit={async (values: RESPONSE.User) => {
          onSubmit(values, oldData?.id ?? 0, oldData?.userAccount ?? "");
        }}
      />
    </Modal>
  );
};

export default UpdateModal;
