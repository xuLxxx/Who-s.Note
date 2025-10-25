import server from "@/utils/request";

export type User = {
  id: number;
  username: string;
  password: string;
  role: string;
  avatar: string;
};

export type Room = {
  id: string;
  name: string;
  avatar: string;
  banner: string;
  userList: User[];
  messages: Message[];
};

export type Message = {
  id: string;
  user: any;
  content: string;
  createdAt: string;
};

export const getRoomList = async () => {
  return server.requestT<{ data: Room[] }>({
    url: `/getRoomList`,
    method: "GET",
  });
};

export const getRoomMessage = async (roomId: string) => {
  return server.requestT<{ data: Message[] }>({
    url: `/${roomId}/getRoomMessage`,
    method: "GET",
  });
};

export const sendRoomMsg = async (roomId: string, content: string) => {
  return server.requestT<{ data: Message }>({
    url: `/${roomId}/sendMessage`,
    method: "POST",
    data: {
      content,
    },
  });
};

export const createRoom = async (data: { name: string; avatar: string }) => {
  return server.requestT<{ data: Room }>({
    url: `/createRoom`,
    method: "POST",
    data,
  });
};

export const getRoomByFullId = async (roomId: string) => {
  return server.requestT<{ data: Room[] }>({
    url: `/${roomId}/getRoomByFullId`,
    method: "GET",
  });
};

export const joinRoom = async (roomId: string) => {
  return server.requestT<{ data: Room }>({
    url: `/${roomId}/joinRoom`,
    method: "POST",
  });
};
