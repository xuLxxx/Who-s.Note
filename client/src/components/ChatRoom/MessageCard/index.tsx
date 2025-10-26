import React, { useState } from "react";
import "./index.less";
import { Avatar, Button, Popover } from "antd";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

interface MessageCardProps {
  message: any;
  index: number;
  messages: any[];
}

export const MessageCard = ({ message, index, messages }: MessageCardProps) => {
  const userInfo = useSelector((state: any) => state.user);
  const isMyMessage = message.user.id === userInfo.id;

  const AvatarNameCom = ({
    username,
    avatar,
  }: {
    username: string;
    avatar: string;
  }) => {
    return (
      <div className="friend-chat-avatar-name">
        <Avatar
          src={avatar || <UserOutlined />}
          className="friend-chat-avatar"
        />
        <div>
          <strong className="friend-chat-avatar-name-text">{username}</strong>
          <div className="friend-chat-avatar-time-text">
            {dayjs(message.createdAt).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        </div>
      </div>
    );
  };

  const ToolBox = () => {
    return (
      <div className="friend-chat-message-tool-box">
        {isMyMessage && <Button>编辑</Button>}
        {isMyMessage && <Button>撤回</Button>}
        <Button>回复</Button>
        {isMyMessage && <Button>删除</Button>}
      </div>
    );
  };

  const ContentCom = ({ content }: { content: string }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    return (
      <Popover
        content={<ToolBox />}
        trigger="hover"
        placement="topRight"
        classNames={{
          body: "friend-chat-message-content-toolbox-body",
        }}
        arrow={false}>
        <div className="friend-chat-message-content-container">
          <div
            className="friend-chat-message-content"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}>
            {content}
          </div>
          {showTooltip && (
            <div className="friend-chat-message-time-content">
              {dayjs(message.createdAt).format("YYYY-MM-DD HH:mm:ss")}
            </div>
          )}
        </div>
      </Popover>
    );
  };

  const renderAvatarName = () => {
    if (index === 0) {
      return (
        <AvatarNameCom
          username={message.user.username}
          avatar={message.user.avatar}
        />
      );
    } else {
      if (message.user.username !== messages[index - 1].user.username) {
        return (
          <>
            <div style={{ marginTop: 16 }}></div>
            <AvatarNameCom
              username={message.user.username}
              avatar={message.user.avatar}
            />
          </>
        );
      }
    }
  };
  return (
    <div className="friend-chat-message">
      {renderAvatarName()}
      <ContentCom content={message.content} />
    </div>
  );
};
