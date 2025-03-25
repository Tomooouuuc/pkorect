import request from "@/libs/request";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { message, Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { DebounceSelect } from "../../components/DebounceSelect";

interface Props {
  visible: boolean;
  onCancel: () => void;
  columns: ProColumns<RESPONSE.Pictrue>[];
  oldData?: RESPONSE.Pictrue;
  onSubmit: () => void;
}
interface TagsValue {
  label: string;
  value: string;
}
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

const UpdateModal: React.FC<Props> = (props) => {
  const actionRef = useRef<ActionType>(null);

  const { visible, onCancel, columns, oldData, onSubmit } = props;
  const [tagValue, setTagValue] = useState<TagsValue[]>();
  useEffect(() => {
    if (visible) {
      const tagData = oldData?.tags.map((tag) => {
        return {
          label: tag.name,
          value: tag.name,
        };
      });
      setTagValue(tagData);
    }
  }, [visible]);

  const modifiedColumns = columns
    .map((column) => {
      if (column.dataIndex === "tagsList") {
        return {
          ...column,
          renderFormItem() {
            return (
              <DebounceSelect
                mode="tags"
                value={tagValue}
                placeholder="请输入"
                fetchOptions={(values) => fetchUserList(values)}
                style={{ width: "100%" }}
                onChange={(newValue) => {
                  if (Array.isArray(newValue)) {
                    setTagValue(newValue);
                  }
                }}
              />
            );
          },
        };
      }
      if (column.dataIndex === "reviewStatus") {
        return false;
      }
      return column;
    })
    .filter((item) => !!item);

  return (
    <Modal
      title={"更新图片"}
      footer={null}
      open={visible}
      onCancel={() => {
        setTagValue([]);
        onCancel();
      }}
      destroyOnClose
    >
      <ProTable
        type={"form"}
        actionRef={actionRef}
        columns={modifiedColumns}
        form={{
          initialValues: {
            ...oldData,
            categoryName: oldData?.category.name,
            tagsList: oldData?.tags.map((tag: any) => {
              return {
                label: tag.name,
                value: tag.name,
              };
            }),
          },
        }}
        onSubmit={async (values: RESPONSE.Pictrue) => {
          const tags = tagValue?.map((tag) => tag.value);
          try {
            await request(`/api/picture/${oldData?.id}`, {
              method: "PUT",
              data: { ...values, tagsList: tags },
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
