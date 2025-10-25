import React, { useState, useEffect, useRef } from "react";
import { Button, Input, Space, message } from "antd";
import { EnterOutlined } from "@ant-design/icons";
import type { Socket } from "socket.io-client";
import { Room, Message, sendRoomMsg } from "@/api/talk";
import { useSelector } from "react-redux";

interface ChatRoomProps {
  socket: Socket | null;
  isConnected: boolean;
  room: Room | null;
  messages: Message[];
  setMessages: (data: any) => void;
}

export default function ChatRoom({
  socket,
  isConnected,
  room,
  messages,
  setMessages,
}: ChatRoomProps): JSX.Element {
  const [messageInput, setMessageInput] = useState<string>("");
  const userInfo = useSelector((state: any) => state.user);
  const chatContentRef = useRef<HTMLDivElement>(null);

  const handleNewMessage = async (data: any) => {
    console.log("Received new message:", data, room, userInfo);
    if (!room?.id) {
      message.error("发送消息失败");
      return;
    }

    if (data.user.userId !== userInfo?.id) {
      console.log("Not my message");
      setMessages((prev: Message[]) => [
        ...prev,
        {
          user: data.user || "服务器",
          content: data.content,
        },
      ]);
      return;
    } else {
      const res = await sendRoomMsg(room.id, data.content);
      if (res?.code === 200) {
        setMessages((prev: Message[]) => [
          ...prev,
          {
            user: data.user || "服务器",
            content: data.content,
          },
        ]);
        // 清空输入框
        setMessageInput("");
      } else {
        message.error("发送消息失败");
      }
      return;
    }
  };

  // 监听服务器消息
  useEffect(() => {
    if (socket) {
      socket.on("new_message", handleNewMessage);
      return () => {
        socket.off("new_message", handleNewMessage);
      };
    }
  }, [socket, room, setMessages]); //当只有socket时，出现过期闭包问题

  // 发送消息
  const handleSendMessage = () => {
    if (messageInput.trim() && socket) {
      if (!room?.id) {
        message.error("请先加入聊天室");
        return;
      }
      socket.emit("send_message", {
        content: messageInput,
        roomId: room?.id || "",
        timestamp: Date.now(),
      });
    } else if (!isConnected) {
      message.error("未连接到服务器，请稍后再试");
    }
  };

  return (
    <>
      <div className="friend-chat-title">{room?.name || "知识从此开始"}</div>
      <div className="friend-chat-content" ref={chatContentRef}>
        {messages.map((msg, index) => (
          <div key={msg.id}>
            <strong>{msg.user.username}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="friend-chat-send">
        <Space.Compact block>
          <Input
            variant="borderless"
            placeholder="请输入消息"
            value={messageInput}
            onPressEnter={handleSendMessage}
            onChange={(e) => setMessageInput(e.target.value)}
            style={{
              borderBottom: "1px solid",
              borderRadius: 0,
              width: "100%",
              paddingLeft: 0,
              fontSize: 18,
              color: "var(--text-gray)",
            }}></Input>
        </Space.Compact>
        <Button
          icon={<EnterOutlined />}
          type="text"
          onClick={handleSendMessage}
          style={{ fontSize: 20 }}></Button>
      </div>
    </>
  );
}
