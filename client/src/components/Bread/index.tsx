import React, { useEffect, useMemo } from "react";
import { useLocation } from "react-router";

import { Breadcrumb, Flex } from "antd";
import { PauseOutlined } from "@ant-design/icons";

import "./index.less";
import type { Menu } from "@/api/system/menu";
import Icon from "../Icon";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface Props {
  menu?: Menu[];
}

export default function BreadCom(props: Props): JSX.Element {
  const location = useLocation();
  const bread = useMemo(() => {
    let path: any;
    path = props.menu?.find((item: Menu) => item.url === location.pathname);
    props.menu?.map((item: Menu) => {
      let child: Menu | undefined;
      if (item.children) {
        child = item.children.find(
          (item: Menu) => item.url === location.pathname
        );
        if (child) {
          path = child;
        }
      }
    });
    if (path) {
      if (path.parentId) {
        const parent = props.menu?.find(
          (item: Menu) => item.id === path.parentId
        );
        if (parent) {
          return [
            {
              herf: parent.url,
              title: (
                <>
                  <Icon type={parent.icon} />
                  <span>{parent.title}</span>
                </>
              ),
            },
            {
              herf: path.url,
              title: (
                <>
                  <Icon type={path.icon} />
                  <span>{path.title}</span>
                </>
              ),
            },
          ];
        }
      } else {
        return [
          {
            herf: path.url,
            title: (
              <>
                <Icon type={path.icon} />
                <span>{path.title}</span>
              </>
            ),
          },
        ];
      }
    }
  }, [location, props.menu]);
  return (
    <>
      <div className="bread">
        <Flex>
          <PauseOutlined style={{ fontSize: 12, marginRight: 6 }} />
          <Breadcrumb items={bread} />
        </Flex>
      </div>
    </>
  );
}
