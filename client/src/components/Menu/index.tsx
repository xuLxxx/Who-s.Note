import { useEffect, useState } from "react";
import * as api from "@/api/system/menu";
import { useNavigate } from "react-router";
import { Menu } from "antd";

import type { MenuProps } from "antd";

import "./index.less";

import Icon from "@/components/Icon";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

type MenuItem = Required<MenuProps>["items"][number];

interface Props {
  menu?: api.Menu[];
}

export default function MenuCom(props: Props): JSX.Element {
  const navigate = useNavigate();
  const [chosedKey, setChosedKey] = useState<string[]>([]); // 当前选中
  const [_, setOpenKeys] = useState<string[]>([]); // 当前需要被展开的项
  const [treeDom, setTreeDom] = useState<MenuItem[]>([]);
  const collapse = useSelector((state: RootState) => state.setting.collapse);

  useEffect(() => {
    const sourceData: api.Menu[] = props.menu || [];
    setTreeDom(makeTreedom(sourceData));
    const paths = location.pathname.split("/").filter((item) => !!item);
    setChosedKey([location.pathname]);
    setOpenKeys(paths.map((item) => `/${item}`));
  }, [props.menu, location.pathname]);

  const makeTreedom = (data: api.Menu[]): MenuItem[] => {
    let tree: MenuItem[] = [];
    data.forEach((item) => {
      if (item.children) {
        tree.push({
          key: item.url.toString(),
          label: item.title,
          icon:
            !item.parentId && item.icon ? <Icon type={item.icon} /> : void 0,
          children: makeTreedom(item.children),
        });
      } else {
        tree.push({
          key: item.url.toString(),
          label: item.title,
          icon:
            !item.parentId && item.icon ? <Icon type={item.icon} /> : void 0,
        });
      }
    });
    return tree;
  };

  const onSelect = (e: any) => {
    if (e?.key) {
      navigate(e.key);
    }
  };

  return (
    <div className="menu">
      <Menu
        mode="inline"
        items={treeDom}
        className="menu-list"
        selectedKeys={chosedKey}
        inlineCollapsed={collapse}
        onOpenChange={(keys: string[]) => setOpenKeys(keys)}
        onSelect={onSelect}></Menu>
    </div>
  );
}
