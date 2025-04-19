import React from "react";
import "./index.component.less";
import svgLogo from "@/assets/react.svg";
import { Button, Dropdown, Flex, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "@/store";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import BreadCom from "../Bread";

export default function HeaderCom(): JSX.Element {
  const dispath = useDispatch<Dispatch>();
  const user = useSelector((state: RootState) => state.user);
  const collapse = useSelector((state: RootState) => state.setting.collapse);
  const menu = useSelector((state: RootState) => state.setting.menu);
  const theme = useSelector((state: RootState) => state.setting.theme);
  const toggleCollapsed = () => {
    dispath.setting.changeCollapse(!collapse);
  };
  const toggleTheme = () => {
    dispath.setting.changeTheme(theme === "dark" ? "light" : "dark");
  };
  const items = [
    {
      key: "1",
      label: "退出登录",
      onClick: () => {
        dispath.user.logout();
      },
    },
  ];
  return (
    <>
      <Row className="header">
        <Col className="title">
          <Flex>
            <img src={svgLogo} />
          </Flex>
          <div style={{ marginLeft: 10 }}>{user.username || "Who"}'s notes</div>
        </Col>
        <Col className="collapse">
          <Button
            type="default"
            className="button-collapse"
            onClick={toggleCollapsed}
            style={{
              marginLeft: 16,
              border: 0,
              width: 40,
              fontSize: 16,
            }}>
            {collapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
        </Col>
        <Col className="bread">
          <BreadCom menu={menu} />
        </Col>
        <Col className="avatar-col" flex="auto">
          <div className="avatar-container">
            <div onClick={toggleTheme} className="theme">
              {theme === "dark" ? <MoonOutlined /> : <SunOutlined />}
            </div>
            <Dropdown menu={{ items }} trigger={["click"]}>
              {user.username || "Who"}
            </Dropdown>
          </div>
        </Col>
      </Row>
    </>
  );
}
