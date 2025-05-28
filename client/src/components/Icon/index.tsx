/* 用于菜单的自定义图标 */
import React from "react";
import { createFromIconfontCN } from "@ant-design/icons";

import "./index.components.less";

const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/c/font_4843413_zp757dp92pa.js",
});

interface Props {
  type: string;
  style?: React.CSSProperties;
}

export default function Icon(props: Props): JSX.Element {
  return (
    <>
      <IconFont type={props.type} className="icon" style={props.style} />
    </>
  );
}
