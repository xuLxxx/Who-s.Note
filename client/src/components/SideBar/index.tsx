import React from "react";
import "./index.less";
import { Flex } from "antd";

import * as menuApi from "@/api/system/menu";

import MenuCom from "../Menu";
import FieldCom from "../Field";
import { useSelector } from "react-redux";
import { RootState } from "@/store";



interface Props {
  menu?: menuApi.Menu[];
}

export default function SideBarCom(): JSX.Element {
  const menuList = useSelector((state: RootState) => state.setting.menu);

  return (
    <>
      <Flex className="sideBar">
        <MenuCom menu={menuList} />
        <FieldCom />
      </Flex>


    </>
  );
}
