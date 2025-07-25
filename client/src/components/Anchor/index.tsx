import { Anchor } from "antd";
import { useCallback, useEffect, useState } from "react";

import "./index.less";

type RawList = {
  key: string;
  href: string;
  title: string;
  level: number;
};

interface List extends RawList {
  children?: List[];
}

export default function AnchorNav(prop: { markdown: string }): JSX.Element {
  const [anchorList, setAnchorList] = useState<List[]>([]);

  const generateAnchorList = useCallback(
    (hNodeList: Array<HTMLElement>) => {
      if (hNodeList.length == 0) return [];
      // 最终生成的列表
      let anchorList: List[] = [];
      // 当前处理的dom元素索引
      let index = 0;
      // 保存当前锚点信息
      let currentAnchor: any = {};

      function transform(item: HTMLElement) {
        let anchor = createAnchor(item);
        // console.log(anchor);
        if (anchorList.length === 0) {
          //第一次执行函数的处理 初始化操作
          anchorList.push(anchor);
          currentAnchor = anchor;
          return;
        }
        //如果标签的大小递增，则往children中添加
        if (anchor.level > currentAnchor.level) {
          currentAnchor.children = currentAnchor?.children ?? []; // children不存在则初始化一个空数组
          recursionFn(currentAnchor.children, anchor); // 递归
        }
        // 如果当前处理的anchor和保存的anchor Level相同或者更小，则判断为当前保存anchor层级的元素处理完毕
        else {
          anchorList.push(anchor);
          currentAnchor = anchor;
        }
      }

      function recursionFn(curChildren: any | any[], anchor: any) {
        // curChildren 为指向的节点的Children
        // 在同一Children的level 永远 都是 最小的在前面
        // curChildren[0] 永远是当前节点的最小的level H1 H2 ..
        if (curChildren.length == 0 || curChildren[0].level == anchor.level) {
          curChildren.push(anchor);
        } else if (curChildren[0].level < anchor.level) {
          //顺序遍历，永远是往最后加
          let lastIndex = curChildren.length - 1;
          curChildren[lastIndex].children = [];
          recursionFn(curChildren[lastIndex].children, anchor);
        }
      }

      function createAnchor(item: HTMLElement) {
        let level = Number(item.nodeName.split("")[1]);
        let anchor: RawList = {
          key: "",
          href: "",
          title: "",
          level, // h标签的层级
        };
        anchor.title = item.innerHTML;
        anchor.href = `#heading-${++index}`;
        anchor.key = anchor.href;
        return anchor;
      }

      for (let item of hNodeList) {
        transform(item);
      }

      return anchorList;
    },
    [location.pathname]
  );

  useEffect(() => {
    let hNodeList: any = document.querySelectorAll(".heading");
    //@ts-ignore
    setAnchorList(generateAnchorList(hNodeList));
    generateAnchorList(hNodeList);
  }, [prop.markdown]);

  return (
    <>
      <Anchor
        items={anchorList}
        affix={false}
        //@ts-ignore
        getContainer={() => document.querySelector(".md-container")}
        className="anchor-list"
        style={{ maxHeight: 200 }}
      />
    </>
  );
}
