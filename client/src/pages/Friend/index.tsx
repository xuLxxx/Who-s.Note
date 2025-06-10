import React, { useEffect } from "react";
import { Button } from "antd";

import ChatRoom from "@/components/ChatRoom";
// import { useSocketIO } from "@/shared/hooks/useSocketIO";
import { useWebSocket } from "@/shared/hooks/useWebSocket";

import "./index.less";

export default function Friend(): JSX.Element {
  // const socket = useSocketIO();
  const { data, onSend } = useWebSocket("/test");
  return (
    <>
      <div className="friend-left">
        <div className="friend-list">
          <div className="friend-card">聊天室1</div>
          <div className="friend-card">聊天室2</div>
        </div>
        <div className="friend-add-room">
          <Button>创建新的聊天室</Button>
        </div>
      </div>
      <div className="frinend-chat-box">
        <ChatRoom />
      </div>
    </>
  );
}
