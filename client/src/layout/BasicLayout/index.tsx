import React, { useEffect, useCallback } from "react";
import { Outlet } from "react-router";
import { Layout } from "antd";

import HeaderCom from "@/components/Header";
import SideBarCom from "@/components/SideBar";
import "./index.less";
import { useSelector } from "react-redux";

const { Content, Header, Sider } = Layout;

const layoutStyle: React.CSSProperties = {
  overflow: "hidden",
  minHeight: "100vh",
};

const headerStyle: React.CSSProperties = {
  padding: 0,
  boxSizing: "border-box",
  height: "54px",
};

const siderStyle: React.CSSProperties = {
  padding: 0,
};

const contentStyle: React.CSSProperties = {
  padding: 10,
  width: "100%",
  overflow: "hidden",
};

function BasicLayout(): JSX.Element {
  const [sideWidth, setSideWidth] = React.useState(60);
  // const dispath = useDispatch<Dispatch>();
  const collapse = useSelector((state: any) => state.setting.collapse);
  useEffect(() => {
    setSideWidth(collapse ? 60 : 200);
  }, [collapse]);

  return (
    <>
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>
          <HeaderCom />
        </Header>
        <Layout className="layout" hasSider>
          <Sider style={siderStyle} width={sideWidth} className="Color">
            <SideBarCom />
          </Sider>
          <Content style={contentStyle}>
            <Outlet></Outlet>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default BasicLayout;
