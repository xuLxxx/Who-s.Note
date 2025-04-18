import React, { useEffect, useRef } from "react";

import "./index.less";
import "./index.type";
import { Card } from "antd";

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

  let currentDrag: EventTarget & HTMLDivElement;
  const dragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // console.log(e);
    e.dataTransfer.effectAllowed = "move";
    currentDrag = e.currentTarget;
    setTimeout(() => {
      currentDrag.classList.add("moving");
    }, 0);
  };
  const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const dragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.target as HTMLDivElement;
    if (
      e.currentTarget === currentDrag ||
      e.currentTarget === dragRef.current
    ) {
      return;
    }
    let listArray = Array.from(dragRef.current?.childNodes || []);
    let currentIndex = listArray.indexOf(currentDrag);
    let targetIndex = listArray.indexOf(e.currentTarget);
    [rowData[currentIndex], rowData[targetIndex]] = [
      rowData[targetIndex],
      rowData[currentIndex],
    ];
    if (currentIndex < targetIndex) {
      dragRef.current?.insertBefore(currentDrag, target.nextSibling);
    } else {
      dragRef.current?.insertBefore(currentDrag, e.currentTarget);
    }
  };
  const dragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    // console.log(e);
    // const target = e.target as HTMLDivElement;
    // target.style.cursor = "auto";
    currentDrag.classList.remove("moving");
  };
  const drop = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("drop", e);
    e.preventDefault();
    console.log("rowDataState", rowData);
  };
  return (
    <>
      <div className="todo-title">Todo List</div>
      <div className="todo-card-container" ref={dragRef}>
        {rowDataState.map((item) => {
          return (
            <div
              key={item.id}
              className="todo-card"
              draggable
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
