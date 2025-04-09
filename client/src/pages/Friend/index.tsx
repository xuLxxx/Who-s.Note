import { getUserInfo } from "@/api/user";
import { Button } from "antd";
import React from "react";

export default function Friend(): JSX.Element {
  return (
    <>
      <div>Friend Page</div>
      <Button onClick={getUserInfo}>LRUCache 缓存测试</Button>
    </>
  );
}
