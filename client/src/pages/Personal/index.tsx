import React, { useEffect, useLayoutEffect, useMemo } from "react";

import "./index.less";
import { Button } from "antd";
import { useLocation } from "react-router";
import { useWebSocket } from "@/shared/hooks/useWebSocket";

export default function Personal(): JSX.Element {
  const location = useLocation();
  const { data, onSend } = useWebSocket("/test");
  useMemo(() => {}, [location.pathname]);
  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);
  useLayoutEffect(() => {});
  const sendMessage = () => {
    onSend({
      msg: "hello",
    });
  };
  return (
    <>
      <div className="personal">
        <Button onClick={sendMessage}>发送Hello至后端</Button>
      </div>
    </>
  );
}
