import React, { useState, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { getToken } from "@/utils/auth";

interface UseSocketIOOptions {
  autoConnect?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
}

interface UseSocketIOResult {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
}

export const useSocketIO = (
  options: UseSocketIOOptions = {}
): UseSocketIOResult => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // 默认配置
  const defaultOptions = {
    autoConnect: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    ...options,
  };

  // 初始化 socket 连接
  useEffect(() => {
    try {
      // 创建 socket 实例
      const newSocket = io("http://localhost:3000", {
        transports: ["websocket"], // 明确使用 WebSocket 协议
        reconnectionAttempts: defaultOptions.reconnectionAttempts,
        reconnectionDelay: defaultOptions.reconnectionDelay,
        autoConnect: defaultOptions.autoConnect,
        auth: {
          token: getToken(),
        },
        query: {
          timestamp: Date.now(),
        },
      });

      // 连接成功事件
      const handleConnect = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      };

      // 连接断开事件
      const handleDisconnect = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
      };

      // 连接错误事件
      const handleError = (error: Error) => {
        console.error("WebSocket error:", error);
      };

      // 注册事件监听
      newSocket.on("connect", handleConnect);
      newSocket.on("disconnect", handleDisconnect);
      newSocket.on("error", handleError);

      // 设置 socket 实例
      setSocket(newSocket);

      // 组件卸载时清理
      return () => {
        newSocket.off("connect", handleConnect);
        newSocket.off("disconnect", handleDisconnect);
        newSocket.off("error", handleError);
        newSocket.disconnect();
        setSocket(null);
      };
    } catch (error) {
      console.error("Failed to initialize socket:", error);
      setSocket(null);
      setIsConnected(false);
      return () => {
        /* 清理函数 */
      };
    }
  }, [
    defaultOptions.autoConnect,
    defaultOptions.reconnectionAttempts,
    defaultOptions.reconnectionDelay,
  ]);

  // 手动连接方法
  const connect = useCallback(() => {
    if (socket && !socket.connected) {
      socket.connect();
    }
  }, [socket]);

  // 手动断开连接方法
  const disconnect = useCallback(() => {
    if (socket && socket.connected) {
      socket.disconnect();
    }
  }, [socket]);

  // 事件监听方法
  const on = useCallback(
    (event: string, callback: (...args: any[]) => void) => {
      if (socket) {
        socket.on(event, callback);
      }
    },
    [socket]
  );

  // 发送消息方法
  const emit = useCallback(
    (event: string, ...args: any[]) => {
      if (socket && socket.connected) {
        socket.emit(event, ...args);
      }
    },
    [socket]
  );

  return {
    socket,
    isConnected,
    connect,
    disconnect,
    on,
    emit,
  };
};
