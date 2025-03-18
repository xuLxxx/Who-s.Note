/**
 * Loading组件
 * 用于按需加载时过渡显示等
 */
import React from "react";
import "./index.less";
// import ImgLoading from "@/assets/loading.gif";
import { Spin, Flex } from "antd";

interface Props {
  style?: React.CSSProperties;
}

export default function LoadingComponent(props: Props): JSX.Element {
  return (
    <div className="back" style={props.style}>
      <Flex
        gap="middle"
        align="center"
        justify="center"
        vertical
        className="loading">
        <Spin size="large" />
        <div className="loading-text">加载中...</div>
      </Flex>
    </div>
  );
}
