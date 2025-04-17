import React, { useEffect, useRef } from "react";
import { Button, Card, Divider } from "antd";

import "./index.less";

import Icon from "@/components/Icon";
import MarkdownPage from "@/components/Markdown";
import useQuery from "@/shared/hooks/useQuery";

function HomeContainer(): JSX.Element {
  const query = useQuery();
  return (
    <>
      <div className="page-home">
        {/* {query.size ? <MarkdownPage /> : ""} */}
        {/* <MarkdownPage /> */}
        {query.size ? <MarkdownPage /> : <div>欢迎来到Who's Note笔记系统</div>}
      </div>
    </>
  );
}

export default HomeContainer;
