import React from "react";
import { Button } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";
import "./index.less";

import Avatar from "@/assets/avatar.jpg";

export default function FieldCom(): JSX.Element {
  return (
    <>
      <div className="field">
        <div className="model">
          <div className="box">
            <img src={Avatar} alt="" />
          </div>
          <Button
            className="button"
            shape="circle"
            icon={<PlusCircleFilled />}></Button>
        </div>
      </div>
    </>
  );
}
