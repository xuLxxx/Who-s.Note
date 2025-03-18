/* 用于菜单的自定义图标 */
import React from "react";
import { createFromIconfontCN } from "@ant-design/icons";

import "./index.components.less";

const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/c/font_4843413_iuw5rujw0q.js",
});

interface Props {
  type: string;
}

export default function Icon(props: Props): JSX.Element {
  return (
    <>
      <IconFont type={props.type} className="icon" />
    </>
  );
}
