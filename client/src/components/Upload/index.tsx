import React, { useEffect, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { Button, message, Modal, Upload } from "antd";

import * as api from "@/api/file";

const { Dragger } = Upload;

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

import "./index.less";

interface Props {
  inModal?: boolean;
  visible: boolean;
  multiple?: boolean;
  maxCount?: number;
  type?: string;
  onClose?: () => void;
}

interface ContentProps {
  dragger?: UploadProps;
}

function App(reactProps: Props): JSX.Element {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const props: UploadProps = {
    multiple: reactProps.multiple ?? false,
    maxCount: reactProps.maxCount ?? 1,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);

      return false;
    },
    fileList,
  };
  const submitFile = async () => {
    const formData = new FormData();

    fileList.forEach((file) => {
      formData.append(reactProps.type!, file as FileType);
    });
    setUploading(true);
    // console.log(formData.getAll("file") as FileType[]);
    api
      .uploadFile(formData)
      .then((res) => {
        if (res.code === 200) {
          setFileList([]);
          message.success("上传成功");
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  return reactProps.inModal ? (
    <Modal
      open={reactProps.visible}
      footer={null}
      onCancel={reactProps.onClose}>
      <Content dragger={props} />
      <div className="footer">
        <Button
          type="primary"
          onClick={submitFile}
          disabled={fileList.length === 0}
          loading={uploading}>
          上传
        </Button>
        <Button type="default" onClick={reactProps.onClose}>
          关闭
        </Button>
      </div>
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

export default App;
