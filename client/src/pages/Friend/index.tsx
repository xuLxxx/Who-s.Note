import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import ChatRoom from "@/components/ChatRoom";
import "./index.less";
import { useSocketIO } from "@/shared/hooks/useSocketIO";
import { CreateRoom } from "./components/CreateRoom";
import { useManageRoomMsgList } from "./hooks/useManageRoomMsgList";
import { RoomCard } from "./components/RoomCard";
import { PlusOutlined } from "@ant-design/icons";

export default function Friend(): JSX.Element {
  const { socket, isConnected, on, emit } = useSocketIO();
  const createRoomRef = React.useRef<any>(null);
  const {
    roomList,
    currentRoom,
    roomId,
    setRoomId,
    msgList,
    setMsgList,
    refreshRoomList,
  } = useManageRoomMsgList(socket);

  const handleCreateRoom = () => {
    createRoomRef.current?.open();
  };

  // 组件挂载时设置事件监听
  useEffect(() => {
    if (socket) {
      // 监听连接成功
      on("connect", () => {
        console.log("成功连接到服务器");
      });

      on("guest_lobby", (data) => {
        console.log("收到服务器响应:", data);
      });

      on("join_room", (data) => {
        console.log("收到服务器响应:", data);
      });

      // 监听服务器消息
      on("test_response", (data) => {
        console.log("收到服务器响应:", data);
      });

      // 监听错误
      on("error", (error) => {
        console.error("WebSocket错误:", error);
      });

      // 组件卸载时清理事件监听
      return () => {
        socket.off("connect");
        socket.off("test_response");
        socket.off("error");
        socket.off("guest_lobby");
        socket.off("join_room");
      };
    }
  }, [socket, on, emit]);

  return (
    <>
      <div className="friend-container">
        <div className="friend-left">
          <div className="friend-list">
            {roomList.map((room) => (
              <RoomCard
                room={room}
                currentRoom={currentRoom}
                setRoomId={setRoomId}></RoomCard>
            ))}
          </div>
          <div className="friend-add-room">
            <Button
              onClick={handleCreateRoom}
              icon={<PlusOutlined />}
              className="friend-add-room-button"></Button>
          </div>
        </div>
        <div className="frinend-chat-box">
          {/* 可以将socket对象传递给ChatRoom组件 */}
          <ChatRoom
            socket={socket}
            isConnected={isConnected}
            room={currentRoom}
            messages={msgList}
            setMessages={setMsgList}
          />
        </div>
      </div>

      <CreateRoom ref={createRoomRef} refreshRoomList={refreshRoomList} />
    </>
  );
}
