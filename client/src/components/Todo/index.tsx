import React, { useEffect, useRef } from "react";

import "./index.less";
import "./index.type";
import { Card } from "antd";

export default function TodoCom(): JSX.Element {
  const rowData = [
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
  ];
  const [rowDataState, setRowDataState] = React.useState<TodoItem[]>(rowData);
  const dragStart = (e: React.DragEvent<HTMLDivElement>) => {
    console.log(e);
    // e.preventDefault();
    const target = e.target as HTMLDivElement;
    target.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
  };
  const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
    // console.log(e);
    e.preventDefault();
    const target = e.target as HTMLDivElement;
    target.style.cursor = "grabbing";
  };
  const dragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    // console.log(e);
    const target = e.target as HTMLDivElement;
    target.style.cursor = "auto";
    document.body.style.userSelect = "all";
  };
  const drop = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("drop", e);
    // e.preventDefault();
    const target = e.target as HTMLDivElement;
    target.style.cursor = "auto";
    document.body.style.userSelect = "all";
  };
  return (
    <>
      <div className="todo-title">Todo List</div>
      <div className="todo-card-container">
        {rowDataState.map((item) => {
          return (
            <div
              key={item.id}
              className="todo-card"
              draggable
              onDragStart={dragStart}
              onDragOver={dragOver}
              onDrop={drop}
              onDragEnd={dragEnd}>
              <div>{item.title}</div>
              <div>{item.content}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
