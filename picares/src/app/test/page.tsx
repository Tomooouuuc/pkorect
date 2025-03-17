import type { SelectProps } from "antd";
import { Select, Spin } from "antd";
import debounce from "lodash/debounce";
import React, { useMemo, useRef, useState } from "react";

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

function DebounceSelect<
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
  } = any,
>({
  fetchOptions,
  debounceTimeout = 800,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
}

// Usage of DebounceSelect
interface UserValue {
  label: string;
  value: string;
}

async function fetchUserList(username: string): Promise<UserValue[]> {
  console.log("fetching user", username);

  return fetch("https://randomuser.me/api/?results=5")
    .then((response) => response.json())
    .then((body) =>
      body.results.map(
        (user: {
          name: { first: string; last: string };
          login: { username: string };
        }) => ({
          label: `${user.name.first} ${user.name.last}`,
          value: user.login.username,
        })
      )
    );
}

const App: React.FC = () => {
  const [value, setValue] = useState<UserValue[]>([]);

  return (
    <DebounceSelect
      mode="multiple"
      value={value}
      placeholder="Select users"
      fetchOptions={fetchUserList}
      style={{ width: "100%" }}
      onChange={(newValue) => {
        if (Array.isArray(newValue)) {
          setValue(newValue);
        }
      }}
    />
  );
};

export default App;

// "use client";
// import request from "@/libs/request";
// import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
// import type { GetProp, UploadFile, UploadProps } from "antd";
// import { Button, Flex, Form, Input, message, Upload } from "antd";
// import ImgCrop from "antd-img-crop";
// import { Image as AntdImage } from "antd/lib";
// import React, { useState } from "react";

// type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

// const App: React.FC = () => {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [imageUrl, setImageUrl] = useState<string>();

//   const doSubmit = async (values: any) => {
//     const formData = new FormData();
//     if (file) {
//       formData.append("image", file);
//     }
//     Object.keys(values).forEach((key) => {
//       if (key !== "userAvatar" && values[key]) {
//         formData.append(key, values[key]);
//       }
//     });
//     try {
//       await request(`/api/picture/upload`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         data: formData,
//       });
//       message.success("更新成功");
//       setFile(null);
//       setImageUrl("");
//     } catch (e: any) {
//       message.error("更新失败，" + e.message);
//     }
//   };
//   const getBase64 = (img: FileType, callback: (url: string) => void) => {
//     const reader = new FileReader();
//     reader.addEventListener("load", () => callback(reader.result as string));
//     reader.readAsDataURL(img);
//   };

//   const onPreview = async (file: UploadFile) => {
//     let src = file.url as string;
//     if (!src) {
//       src = await new Promise((resolve) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(file.originFileObj as FileType);
//         reader.onload = () => resolve(reader.result as string);
//       });
//     }
//     const image = new Image();
//     image.src = src;
//     const imgWindow = window.open(src);
//     imgWindow?.document.write(image.outerHTML);
//   };

//   const handleChange = (info: any) => {
//     if (info.file.status === "uploading") {
//       setLoading(true);
//       return;
//     }
//     if (info.file.status === "done") {
//       setFile(info.file.originFileObj);
//       getBase64(info.file.originFileObj as FileType, (url) => {
//         setLoading(false);
//         setImageUrl(url);
//       });
//     }
//   };

//   const uploadButton = (
//     <button style={{ border: 0, background: "none" }} type="button">
//       {loading ? <PlusOutlined /> : <LoadingOutlined />}
//       <div style={{ marginTop: 8 }}>Upload</div>
//     </button>
//   );

//   return (
//     <Flex gap="middle" wrap>
//       <Form onFinish={(values) => doSubmit(values)}>
//         <ImgCrop>
//           <Upload
//             listType="picture-card"
//             showUploadList={false}
//             onChange={handleChange}
//             onPreview={onPreview}
//           >
//             {loading ? (
//               <LoadingOutlined />
//             ) : (
//               <AntdImage
//                 src={imageUrl}
//                 alt="image"
//                 style={{ width: "100%" }}
//                 preview={false}
//               />
//             )}
//           </Upload>
//         </ImgCrop>
//         <Form.Item label="name" name="name">
//           <Input />
//         </Form.Item>
//         {/* <Form.Item
//           label="userAccount"
//           name="userAccount"
//           rules={[{ required: true, message: "Please input your username!" }]}
//         >
//           <Input />
//         </Form.Item> */}
//         <Form.Item label={null}>
//           <Button type="primary" htmlType="submit">
//             Submit
//           </Button>
//         </Form.Item>
//       </Form>
//     </Flex>
//   );
// };

// export default App;
