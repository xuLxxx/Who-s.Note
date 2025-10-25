import React from "react";
import "./index.less";
import { Room } from "@/api/talk";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

export function RoomCard({
  room,
  currentRoom,
  setRoomId,
}: {
  room: Room;
  currentRoom: Room | null;
  setRoomId: (id: string) => void;
}): JSX.Element {
  return (
    <div
      className={`friend-room-card ${
        currentRoom?.id === room.id ? "friend-room-card-active" : ""
      }`}
      key={room.id}
      onClick={() => setRoomId(room.id)}>
      <div>
        <Avatar
          className="friend-room-card-avatar"
          shape="square"
          src={room.avatar || <UserOutlined />}></Avatar>
      </div>
      <span className="friend-room-card-name">{room.name}</span>
    </div>
  );
}
