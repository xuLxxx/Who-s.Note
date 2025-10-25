import { useEffect, useState } from "react";
import { Message, Room, getRoomList, getRoomMessage } from "@/api/talk";
import { Socket } from "socket.io-client";

export const useManageRoomMsgList = (socket: Socket | null) => {
  const [roomList, setRoomList] = useState<Room[]>([]);
  const [msgList, setMsgList] = useState<Message[]>([]);
  const [roomId, setRoomId] = useState<string>("");
  const currentRoom = roomList.find((room) => room.id === roomId) || null;

  const refreshRoomList = async () => {
    clearData();
    await fetchRoomList();
  };

  const clearData = () => {
    setRoomId("");
    setMsgList([]);
    setRoomList([]);
  };

  const fetchRoomList = async () => {
    const result = await getRoomList();
    if (result.code === 200) {
      setRoomList(result.data);
    }
  };

  const fetchRoomMessage = async () => {
    setMsgList([]);
    const result = await getRoomMessage(roomId);
    if (result.code === 200) {
      setMsgList(result.data);
    }
  };

  useEffect(() => {
    fetchRoomList();
  }, []);

  // 修改 useEffect 中的 user_joined 事件处理逻辑
  useEffect(() => {
    if (roomId) {
      fetchRoomMessage();
      if (socket) {
        // 监听新用户加入房间
        socket.on("user_joined", (data) => {
          console.log("New user joined:", data);
          // 使用函数式更新，确保获取最新的 msgList 状态
        });
        socket.emit("join_room", {
          roomId,
        });
      }
    }

    return () => {
      socket?.off("user_joined");
    };
  }, [roomId]);

  return {
    roomList,
    msgList,
    roomId,
    setRoomId,
    setMsgList,
    currentRoom,
    refreshRoomList,
  };
};
