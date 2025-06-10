import React from "react";
import { io } from "socket.io-client";

export const useSocketIO = () => {
  const [socket, setSocket] = React.useState<any>(null);
  const Socket = io("ws://localhost:3000", {
    reconnectionDelayMax: 10000,
    auth: {
      token: "123",
    },
    query: {
      "my-key": "my-value",
    },
  });
  React.useEffect(() => {
    setSocket(Socket);
    return () => {
      Socket.disconnect();
    };
  });
  return socket;
};
