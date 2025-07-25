import React, { useEffect, useRef, useState } from "react";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";
import { GetProp, UploadFile, UploadProps, Image, FormProps } from "antd";
import { Button, Form, Input, message, Modal, Upload } from "antd";

import * as api from "@/api/file";

const { Dragger } = Upload;

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

import "./index.less";

interface Props {
  inModal?: boolean;
  visible: boolean;
  multiple?: boolean;
  maxCount?: number;
  type?: string;
  FileType?: string;
  onClose?: () => void;
  update?: () => void;
}

interface ContentProps {
  dragger?: UploadProps;
}

type FieldType = {
  title: string;
  fileUrl: string;
  pic: string;
};

type FileObj = {
  fileType?: string;
  fileUrl?: string;
  pic?: string;
};

function App(reactProps: Props): JSX.Element {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  // const [posterList, setPosterList] = useState<UploadFile[]>([]);
  const poster = useRef<UploadFile>();
  let fileObj: FileObj = {
    fileType: "",
    fileUrl: "",
    pic: "",
  };
  const [uploading, setUploading] = useState(false);
  const props: UploadProps = {
    multiple: reactProps.multiple || false,
    maxCount: reactProps.maxCount || 1,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      console.log(file);
      if (file.size > 1024 * 1024 * 1024) {
        message.error("文件大小不能超过1GB");
        return false;
      }

      if (!reactProps.FileType && file.type !== reactProps.FileType) {
        message.error("文件类型只能为" + reactProps.FileType);
        return false;
      }

      setFileList([...fileList, file]);

      return false;
    },
    fileList,
  };
  const submitFile = async () => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append(reactProps.type!, file as FileType);
      });
      setUploading(true);
      api
        .uploadFile(formData)
        .then((res) => {
          if (res.code === 200) {
            if (res.data.fileName.split(".").pop() == "md") {
              fileObj.fileType = "text/markdown";
              fileObj.fileUrl = res.data.fileUrl;
            } else {
              fileObj.fileType = res.data.fileType;
              fileObj.fileUrl = res.data.fileUrl;
            }
            resolve(true);
          } else {
            message.error(res.message);
            reject(false);
          }
        })
        .catch((err) => {
          message.error(err.message);
          setUploading(false);
          reject(false);
        });
    });
  };
  const onFinishFailed = () => {
    message.error("请完成表单填写");
  };
  const savePoster = (file: FileType) => {
    poster.current = file;
  };
  const submitPoster = () => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append(reactProps.type!, poster.current?.originFileObj as FileType);
      console.log(formData);
      api
        .uploadFile(formData)
        .then((res) => {
          if (res.code === 200) {
            fileObj.pic = res.data.fileUrl;
            resolve(true);
          } else {
            message.error(res.message);
            reject(false);
          }
        })
        .catch((err) => {
          setUploading(false);
          message.error(err.message);
          reject(false);
        });
    });
  };
  const submitForm: FormProps<FieldType>["onFinish"] = async (values: any) => {
    const res1 = await submitFile();
    setTimeout(async () => {
      const res2 = await submitPoster();
      if (!res1 || !res2) {
        setUploading(false);
        return;
      }
      if (!fileObj.fileUrl || !fileObj.fileType || !values.title) {
        message.error("请完成表单填写");
        setUploading(false);
        return;
      }
      const form = {
        title: values.title,
        pic: fileObj.pic || "",
        fileUrl: fileObj.fileUrl,
        fileType: fileObj.fileType,
      };
      api
        .saveMarkdown(form)
        .then((res) => {
          if (res.code === 200) {
            message.success("上传成功");
            reactProps.onClose && reactProps.onClose();
            reactProps.update && reactProps.update();
          }
        })
        .finally(() => {
          setUploading(false);
        });
      // console.log(values);
    }, 1000);
  };
  return reactProps.inModal ? (
    <Modal
      open={reactProps.visible}
      footer={null}
      onCancel={reactProps.onClose}>
      <Form
        style={{ marginTop: 20 }}
        onFinish={submitForm}
        onFinishFailed={onFinishFailed}>
        <Form.Item label={null}>
          <Content dragger={props} />
        </Form.Item>
        <Form.Item name="title" label="笔记 域名" rules={[{ required: true }]}>
          <Input></Input>
        </Form.Item>
        <Form.Item label="笔记 封面">
          <AvatarUpload onUpload={savePoster} />
        </Form.Item>
        <div className="markdown-footer">
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={fileList.length === 0}
              loading={uploading}>
              上传
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="default" onClick={reactProps.onClose}>
              关闭
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  ) : (
    <>
      <Content dragger={props} />
      <Button type="primary" onClick={submitFile}>
        上传
      </Button>
    </>
  );
}

function Content(props: ContentProps): JSX.Element {
  return (
    <div className="dragger">
      <Dragger {...props.dragger}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或者拖曳文件进行上传</p>
        <p className="ant-upload-hint">
          支持单个或多个文件上传。严禁上传公司数据或其他禁止的文件。
        </p>
      </Dragger>
    </div>
  );
}

function AvatarUpload(props: { onUpload: Function }): JSX.Element {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handlePreview = async (file: UploadFile) => {
    console.log(file);
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const removePicture = () => {
    setFileList([]);
  };

  const beforeUpload = (file: FileType) => {
    return false;
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    const file = newFileList[0];
    console.log(file);
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    if (isJpgOrPng && isLt2M) {
      setFileList(newFileList);

      props.onUpload(file);
    }
    return true;
  };

  return (
    <>
      <Upload
        listType="picture-circle"
        fileList={fileList}
        onChange={handleChange}
        onPreview={handlePreview}
        onRemove={removePicture}
        beforeUpload={beforeUpload}>
        {fileList.length ? null : uploadButton}
      </Upload>
      {previewImage && (
        <>
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        </>
      )}
    </>
  );
}

export default App;
