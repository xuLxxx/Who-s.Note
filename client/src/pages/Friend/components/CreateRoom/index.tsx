import { Avatar, Button, Card, Input, message, Modal, Upload } from "antd";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import "./index.less";
import {
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { uploadFile } from "@/api/file";
import { createRoom, getRoomByFullId, joinRoom, Room } from "@/api/talk";
import { debounce } from "@/utils/debounce";

const { Search } = Input;
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface CreateRoomProps {
  refreshRoomList: () => void;
}

export const CreateRoom = React.forwardRef(
  ({ refreshRoomList }: CreateRoomProps, ref) => {
    const roomName = useRef<string>("");
    const [roomId, setRoomId] = useState<string>("");
    const roomAvatar = useRef<string>("");
    const [visible, setVisible] = useState<boolean>(false);
    const [step, setStep] = useState<number>(1);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [searchedRoom, setSearchedRoom] = useState<Room[] | null>(null);
    const [searchLoading, setSearchLoading] = useState<boolean>(false);

    const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
      setFileList(newFileList);
    };

    const clearData = () => {
      roomName.current = "";
      roomAvatar.current = "";
      setStep(1);
      setFileList([]);
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

    useImperativeHandle(ref, () => ({
      roomName,
      open: () => setVisible(true),
    }));

    const handleCreateRoom = async () => {
      const res = await createRoom({
        name: roomName.current,
        avatar: roomAvatar.current,
      });
      if (res?.code === 200) {
        message.success("创建聊天室成功");
        refreshRoomList();
        clearData();
        setVisible(false);
      } else {
        message.error("创建聊天室失败");
      }
    };

    const searchRoomId = async () => {
      console.log("searchRoomId", roomId);
      if (!roomId) {
        setSearchedRoom(null);
        setSearchLoading(false);
        return;
      }
      const res = await getRoomByFullId(roomId);
      setSearchLoading(false);
      if (res?.code === 200) {
        setSearchedRoom(res.data);
      } else {
        message.error("搜索聊天室失败");
      }
    };

    const handleJoinRoom = async (roomId: string) => {
      if (!roomId) {
        message.error("聊天室ID获取失败");
        return;
      }
      const res = await joinRoom(roomId);
      if (res?.code === 200) {
        message.success("加入聊天室成功");
        refreshRoomList();
        clearData();
        setVisible(false);
      } else {
        message.error(res?.message || "加入聊天室失败");
      }
    };

    const debounceSearchRoomId = debounce(searchRoomId, 500);

    useEffect(() => {
      setSearchLoading(true);
      debounceSearchRoomId();
    }, [roomId]);
    return (
      <>
        <Modal
          open={visible}
          centered
          title="创建或加入聊天室"
          onCancel={() => setVisible(false)}
          onOk={() => setVisible(false)}
          footer={[
            <>
              {step === 2 && (
                <Button key="cancel" onClick={() => setStep(1)}>
                  上一步
                </Button>
              )}
            </>,
            <>
              {step === 2 && (
                <Button key="ok" type="primary" onClick={handleCreateRoom}>
                  创建
                </Button>
              )}
            </>,
          ]}>
          {step === 1 && (
            <>
              <Card
                className="create-room-card"
                onClick={() => setStep(2)}
                style={{ cursor: "pointer" }}>
                <div className="create-room-content">
                  <div className="create-room-icon">
                    <PlusOutlined color="#676772" />
                  </div>
                  <div>
                    <div className="create-room-title">创建新的聊天室</div>
                    <div className="create-room-spec">
                      创建自己的聊天室让好友根据ID进入
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="create-room-card">
                <div>
                  <div className="create-room-title">加入</div>
                  <div className="create-room-spec">输入完整ID加入聊天室</div>
                  <Input
                    className="create-room-search"
                    allowClear
                    suffix={<SearchOutlined />}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="请输入聊天室Id"
                    // maxLength={18}
                  />
                  <Card
                    className={`create-room-search-result 
                      ${
                        searchedRoom || searchLoading
                          ? "create-room-search-result-has-data"
                          : "create-room-search-result-hidden"
                      }`}>
                    <div className="create-room-search-result-content">
                      {searchedRoom &&
                        searchedRoom.length === 0 &&
                        searchLoading && (
                          <>
                            <LoadingOutlined />
                          </>
                        )}
                      {searchedRoom &&
                        searchedRoom.length === 0 &&
                        !searchLoading &&
                        "无此聊天室"}
                    </div>

                    {searchedRoom && searchedRoom.length > 0 && (
                      <>
                        <div
                          className="create-room-search-result-room-card"
                          onClick={() => handleJoinRoom(searchedRoom[0].id)}>
                          <div>
                            <Avatar
                              className="create-room-search-result-room-card-avatar"
                              shape="square"
                              src={
                                searchedRoom[0].avatar || <UserOutlined />
                              }></Avatar>
                          </div>
                          <div className="create-room-search-result-room-card-name">
                            {searchedRoom[0].name}
                          </div>
                        </div>
                      </>
                    )}
                  </Card>
                </div>
              </Card>
            </>
          )}
          {step === 2 && (
            <>
              <div className="create-room-upload-img">
                <div>
                  <ImgCrop rotationSlider>
                    <Upload
                      customRequest={async ({ file, onSuccess, onError }) => {
                        console.log(file);
                        const formData = new FormData();
                        formData.append("file", file);
                        const res = await uploadFile(formData);
                        if (res?.code === 200) {
                          roomAvatar.current = res.data.fileUrl || "";
                          onSuccess?.(res.data.fileUrl || "");
                        } else {
                          onError?.(res?.message || "上传失败");
                        }
                      }}
                      listType="picture-card"
                      fileList={fileList}
                      maxCount={1}
                      onChange={onChange}
                      onPreview={onPreview}>
                      {fileList.length <= 0 && <PlusOutlined />}
                    </Upload>
                  </ImgCrop>
                </div>
                <div className="create-room-upload-img-content">
                  <div className="create-room-upload-img-title">
                    上传聊天室封面
                  </div>
                  <div className="create-room-upload-img-spec">
                    图片最小建议128 * 128
                  </div>
                  <div className="create-room-upload-img-spec">
                    建议尺寸512 * 512
                  </div>
                </div>
              </div>
              <p>聊天室名称</p>
              <Input
                onChange={(e) => (roomName.current = e.target.value)}
                placeholder="请输入名称"
                maxLength={18}
              />
            </>
          )}
        </Modal>
      </>
    );
  }
);
