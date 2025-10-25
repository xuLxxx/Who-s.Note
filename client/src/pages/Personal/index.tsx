import React, { useEffect, useLayoutEffect, useMemo } from "react";

import "./index.less";
import { Button } from "antd";
import { useLocation } from "react-router";
import { getUserInfo } from "@/api/user";

export default function Personal(): JSX.Element {
  const location = useLocation();
  useMemo(() => {}, [location.pathname]);
  return (
    <>
      <div>Friend Page</div>
      <Button onClick={getUserInfo}>LRUCache 缓存测试</Button>
    </>
  );
}
