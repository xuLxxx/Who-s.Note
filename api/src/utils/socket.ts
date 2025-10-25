import { Server, Socket } from "socket.io";
import { verifyToken, verifyTokenByReq } from "./auth";
import { s } from "@fullcalendar/resource/internal-common";

// 存储所有连接的客户端
let connectedUsers: { [key: string]: { socket: Socket; userInfo?: any } } = {};

// Socket.io 服务器实例
let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
  });

  // 连接事件处理
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id} ${socket.handshake.auth.token}`);
    const token = verifyToken(socket.handshake.auth.token);
    if (!token.id) {
      socket.emit("guest_lobby", {
        success: false,
        message: "token过期",
      });
      socket.disconnect(true);
      return;
    } else {
      connectedUsers[socket.id] = {
        socket,
        userInfo: {
          userId: token.id,
          username: token.username,
          role: token.role,
          avatar: token.avatar,
        },
      };
      socket.emit("guest_lobby", {
        success: true,
        message: "验证成功",
        data: {
          userId: token.id,
        },
      });
    }
    socket.on("guest_lobby", (data) => {
      console.log(`Guest connected: ${socket.id} ${data}`);
    });

    // 断开连接处理
    socket.on("leave", (data: any) => {
      console.log(`User disconnected: ${socket.id}`);
      // 广播用户离开信息
      io.to(data.roomId).emit("user_leaved", {
        user: connectedUsers[socket.id].userInfo?.username || "Unknown",
        socketId: socket.id,
      });
      delete connectedUsers[socket.id];
    });

    // 加入房间
    socket.on("join_room", (data) => {
      try {
        // 加入房间
        socket.join(data.roomId);
        console.log(`User ${socket.id} joined room ${data.roomId}`);
        io.to(data.roomId).emit("user_joined", {
          user: connectedUsers[socket.id].userInfo || "Unknown",
          socketId: socket.id,
        });
      } catch (error) {
        console.error("Join room failed:", error);
      }
    });

    // 测试消息处理
    socket.on("test_message", (data) => {
      console.log("Received test message:", data);
      socket.emit("test_response", { message: "Message received!" });
    });

    // 聊天消息处理
    socket.on("send_message", (data) => {
      console.log("Chat message:", data);
      // 广播给所有客户端
      io.to(data.roomId).emit("new_message", {
        user: connectedUsers[socket.id].userInfo || "System",
        content: data.content,
        timestamp: data.timestamp,
        socketId: socket.id,
      });
    });

    // 发送给特定用户
    socket.on("send_private_message", (data) => {
      console.log("Private message:", data);
      // 查找目标用户的 socketId
      const targetSocketId = Object.keys(connectedUsers).find(
        (id) => connectedUsers[id].userInfo?.userId === data.targetUserId
      );

      if (targetSocketId) {
        // 发送给目标用户
        io.to(targetSocketId).emit("private_message", {
          from: connectedUsers[socket.id].userInfo?.username || "Unknown",
          content: data.content,
          timestamp: data.timestamp,
        });

        // 确认发送成功给发送者
        socket.emit("message_delivered", {
          success: true,
          to: data.targetUserId,
        });
      } else {
        socket.emit("message_delivered", {
          success: false,
          message: "用户不在线",
        });
      }
    });
  });

  return io;
};

// 获取 Socket.io 实例
export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

// 获取连接的用户信息
export const getConnectedUsers = () => {
  return Object.keys(connectedUsers).map((id) => ({
    socketId: id,
    userInfo: connectedUsers[id].userInfo,
  }));
};

// 获取连接的用户数量
export const getConnectedUsersCount = () => {
  return Object.keys(connectedUsers).length;
};
