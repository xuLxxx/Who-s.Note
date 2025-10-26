import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Avatar, Button, Card, Input, message, Modal, Upload } from "antd";
import { useLocation } from "react-router";
import { getUserInfo, updateUserInfo } from "@/api/user";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "@/store";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import "./index.less";
import { uploadFile } from "@/api/file";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export default function Personal(): JSX.Element {
  const location = useLocation();
  const userInfo = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<Dispatch>();
  const [visible, setVisible] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: (userInfo.id || -1).toString(),
      name: userInfo?.username || "user",
      status: "done",
      url: userInfo?.avatar || "",
    },
  ]);
  const form = useRef<{
    username: string;
    avatar: string;
  }>({
    username: userInfo?.username || "",
    avatar: userInfo?.avatar || "",
  });

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const handleEditConfirm = async () => {
    const res = await updateUserInfo(form.current);
    if (res?.code === 200) {
      dispatch({
        type: "user/setUserInfo",
        payload: {
          username: res.data.username,
          avatar: res.data.avatar,
        },
      });
      message.success("更新成功");
      setVisible(false);
    } else {
      message.error(res?.message || "更新失败");
    }
  };

  useMemo(() => {}, [location.pathname]);
  return (
    <>
      <Card>
        <div className="personal-avatar-container">
          <div className="personal-avatar-label">头像：</div>
          <Avatar
            className="personal-avatar"
            shape="circle"
            src={userInfo?.avatar || <UserOutlined />}></Avatar>
        </div>

        <div className="personal-username">
          <strong>用户名：</strong>
          {userInfo?.username}
        </div>

        <div className="personal-edit-button">
          <Button onClick={() => setVisible(true)}>编辑信息</Button>
        </div>
        <Modal
          title="编辑信息"
          open={visible}
          onCancel={() => setVisible(false)}
          onOk={handleEditConfirm}>
          <div className="personal-modal-content">
            <div className="personal-modal-avatar">
              <div>
                <ImgCrop rotationSlider cropShape="round">
                  <Upload
                    customRequest={async (options) => {
                      const formData = new FormData();
                      formData.append("file", options.file);
                      const res = await uploadFile(formData);
                      if (res?.code === 200) {
                        // message.success("上传成功");
                        setFileList([
                          {
                            url: res.data.fileUrl,
                            status: "done",
                            name: res.data.fileName,
                            uid: (userInfo.id || -1).toString(),
                          },
                        ]);
                        form.current.avatar = res.data.fileUrl;
                      } else {
                        message.error(res?.message || "上传失败");
                      }
                    }}
                    listType="picture-circle"
                    fileList={fileList}
                    maxCount={1}
                    onChange={onChange}
                    onPreview={onPreview}>
                    {fileList.length <= 0 && "+ Upload"}
                  </Upload>
                </ImgCrop>
              </div>
              <div>上传头像</div>
            </div>
            <div className="personal-modal-username">
              <div className="personal-modal-username-label">用户名</div>
              <Input
                placeholder="请输入用户名"
                defaultValue={userInfo?.username}
                onChange={(e) => (form.current.username = e.target.value)}
              />
            </div>
          </div>
        </Modal>
      </Card>
    </>
  );
}
