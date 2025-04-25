import React, { useEffect, useRef } from "react";

import "./index.less";
import "./index.type";
import { Button, Card, Input, Popconfirm } from "antd";
import type { PopconfirmProps } from "antd";
import {
  ClockCircleOutlined,
  EditOutlined,
  FileTextOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { InputRef } from "antd";

export default function TodoCom(): JSX.Element {
  let rowData = [
    {
      id: 1, // 唯一标识
      title: "Todo Item",
      content: "Todo Content",
      status: "completed",
    },
    {
      id: 2,
      title: "Todo Item",
      content: "Todo Content",
      status: "completed",
    },
    {
      id: 3,
      title: "Todo Item",
      content: "Todo Content",
      status: "completed",
    },
    {
      id: 4,
      title: "Todo Item",
      content: "Todo Content",
      status: "completed",
    },
  ];
  const [rowDataState, setRowDataState] = React.useState<TodoItem[]>(rowData);
  const dragRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<InputRef>(null);
  const [editCondition, setEditCondition] = React.useState<boolean>(false);
  const [editModal, setEditModal] = React.useState<boolean>(false);
  const [addTitle, setAddTitle] = React.useState<string>("");

  let currentDrag: EventTarget & HTMLDivElement;
  var img = new Image();
  img.src =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cpath /%3E%3C/svg%3E";
  let root = document.getElementById("root");
  var cloneNode: HTMLDivElement = document.createElement("div");
  var cloneObj: HTMLDivElement = document.createElement("div");
  var reset: Animation | null;
  var offsetX = 0;
  var offsetY = 0;
  var startX = 0;
  var startY = 0;

  const dragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = "move";
    currentDrag = e.currentTarget;
    e.dataTransfer.setDragImage(img, 0, 0);
    cloneObj = currentDrag.cloneNode(true) as HTMLDivElement;
    currentDrag.classList.add("moving");
    setTimeout(() => {
      var rect = currentDrag.getBoundingClientRect();
      var left = rect.left;
      var top = rect.top;
      startX = e.clientX;
      startY = e.clientY;
      offsetX = startX - left;
      offsetY = startY - top;
      cloneObj.style.width = currentDrag.offsetWidth - 10 + "px";
      cloneObj.style.height = currentDrag.offsetHeight - startY + "px";
      cloneObj.style.transform = "translate3d(0,0,0)";
      cloneObj.classList.remove("todo-card");
      cloneNode.appendChild(cloneObj);
      cloneNode.classList.add("drag-node");
      cloneNode.style =
        "transform:translate3d( " + left + "px ," + top + "px,0);";
      root?.appendChild(cloneNode);
    }, 0);
  };
  const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const dragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.target as HTMLDivElement;
    if (
      e.target === currentDrag ||
      e.currentTarget === dragRef.current ||
      target === cloneObj ||
      e.currentTarget === cloneObj
    ) {
      return;
    }
    // 想要解决 动画没有结束前，太快的重新拖曳，将结点插入到了克隆元素内的bug，但未解决
    let listArray = Array.from(dragRef.current?.childNodes || []);
    let currentIndex = listArray.indexOf(currentDrag);
    let targetIndex = listArray.indexOf(e.currentTarget);
    [rowData[currentIndex], rowData[targetIndex]] = [
      rowData[targetIndex],
      rowData[currentIndex],
    ];
    if (currentIndex < targetIndex) {
      dragRef.current?.insertBefore(
        currentDrag,
        target.nextSibling
      ) as HTMLDivElement; // insertBefore(newNode,referenceNode) newNode 要插入的节点。 referenceNode 作为参照节点，即要插入的位置。
    } else {
      dragRef.current?.insertBefore(
        currentDrag,
        e.currentTarget
      ) as HTMLDivElement;
    }
  };
  const dragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (cloneNode) {
      var rect = e.currentTarget.getBoundingClientRect();
      var left = rect.left;
      var top = rect.top;

      reset = cloneNode.animate(
        [
          { transform: cloneNode.style.transform },
          { transform: "translate3d(" + left + "px," + top + "px,0)" },
        ],
        {
          duration: 150,
          easing: "ease-in-out",
        }
      );
      reset.onfinish = function () {
        root?.removeChild(cloneNode);
        cloneObj && cloneNode.removeChild(cloneObj);
        currentDrag.classList.remove("moving");
      };
      // cloneNode.removeChild(cloneObj);
    }
  };
  const drag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // 鼠标相对于视口的位置 e.clientX e.clientY （e是鼠标对象）
    if (cloneNode) {
      var left = ~~(e.clientX - offsetX);
      var top = ~~(e.clientY - offsetY);
      cloneNode.style =
        "transform:translate3d( " + left + "px," + top + "px,0);";
    }
  };
  const drop = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("drop", e);
    e.preventDefault();
    console.log("rowDataState", rowData);
  };
  const blur = (e: any) => {
    console.log(
      "e?.target.value",
      e?.target.value,
      "addTitle",
      addTitle,
      "editCondition",
      editCondition,
      "editModal",
      editModal
    );
    if (addTitle || editModal) {
      return;
    }
    e.target.placeholder = "新建一个待办";
    setEditCondition(false);
  };
  const focus = (e: any) => {
    e.target.placeholder = "";
    console.log(e?.target.value, addTitle, editCondition);
    setEditCondition(true);
    console.log("true");
  };
  useEffect(() => {
    inputRef.current?.nativeElement?.addEventListener("blur", blur);
    inputRef.current?.nativeElement?.addEventListener("focus", focus);
    return () => {
      inputRef.current?.nativeElement?.removeEventListener("blur", blur);
      inputRef.current?.nativeElement?.removeEventListener("focus", focus);
    };
  }, [addTitle, editModal]);
  return (
    <>
      <div className="todo-title">Todo List</div>
      <div className="todo-add">
        <Input
          classNames={{
            input: "todo-add-input",
          }}
          ref={inputRef}
          autoComplete="off"
          placeholder="新建一个待办"
          value={addTitle}
          onChange={(e) => {
            setAddTitle(e.target.value);
          }}
          prefix={<PrefixButton condition={editCondition} />}
          suffix={
            <SuffixButton
              condition={editCondition}
              setCondition={setEditCondition}
              setModal={setEditModal}
            />
          }></Input>
      </div>
      <div className="todo-card-container" ref={dragRef}>
        {rowDataState.map((item) => {
          return (
            <div
              key={item.id}
              className="todo-card"
              draggable
              onDrag={drag}
              onDragStart={dragStart}
              onDragOver={dragOver}
              onDragEnter={dragEnter}
              onDrop={drop}
              onDragEnd={dragEnd}>
              <div>{item.title}</div>
              <div>{item.content}</div>
              <div>{item.id}</div>
              <div>{item.status}</div>
              <button>11</button>
            </div>
          );
        })}
      </div>
    </>
  );
}

function PrefixButton({ condition }: { condition: boolean }) {
  return (
    <>
      <Button
        type="text"
        className="add-edit-button"
        onMouseDown={(e) => {
          e.preventDefault();
        }}
        icon={
          condition ? <PlusOutlined className="icon-plus" /> : <EditOutlined />
        }></Button>
    </>
  );
}

function SuffixButton({
  condition,
  setCondition,
  setModal,
}: {
  condition: boolean;
  setCondition: Function;
  setModal: Function;
}) {
  const [clockModal, setClockModal] = React.useState<boolean>(false);
  const [contentModal, setContentModal] = React.useState<boolean>(false);
  const setTodoTime = () => {
    console.log("click");
    setModal(true);
    setClockModal(true);
    if (contentModal) {
      setContentModal(false);
    }
  };
  const confirmClock: PopconfirmProps["onConfirm"] = () => {
    console.log("onConfirm");
    setModal(false);
    setClockModal(false);
  };
  const cancelClock: PopconfirmProps["onCancel"] = () => {
    console.log("onCancel");
    setModal(false);
    setClockModal(false);
  };
  const setTodoContent = () => {
    console.log("click");
    setModal(true);
    setContentModal(true);
    if (clockModal) {
      setClockModal(false);
    }
  };
  const confirmContent: PopconfirmProps["onConfirm"] = () => {
    console.log("onConfirm");
    setModal(false);
    setContentModal(false);
  };
  const cancelContent: PopconfirmProps["onCancel"] = () => {
    console.log("onCancel");
    setModal(false);
    setContentModal(false);
  };
  return (
    <>
      {condition && (
        <>
          <Popconfirm
            title="选择待办截止时间"
            description={<>div</>}
            open={clockModal}
            onConfirm={confirmClock}
            onCancel={cancelClock}
            icon={<ClockCircleOutlined style={{ color: "var(--color)" }} />}
            okText="确认"
            cancelText="取消">
            <Button
              type="text"
              icon={<ClockCircleOutlined />}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              onClick={setTodoTime}></Button>
          </Popconfirm>
          <Popconfirm
            title="编辑待办内容"
            description="Are you sure to delete this task?"
            open={contentModal}
            onConfirm={confirmContent}
            onCancel={cancelContent}
            icon={<FileTextOutlined style={{ color: "var(--color)" }} />}
            okText="Yes"
            cancelText="No">
            <Button
              type="text"
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              onClick={setTodoContent}
              icon={<FileTextOutlined />}></Button>
          </Popconfirm>
        </>
      )}
    </>
  );
}
