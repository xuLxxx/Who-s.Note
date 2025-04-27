import React, { useEffect, useRef } from "react";

import * as api from "@/api/todo";

import "./index.less";
import "./index.type";
import {
  Button,
  Card,
  DatePicker,
  Input,
  message,
  Popconfirm,
  Tag,
} from "antd";
import type { GetProps, PopconfirmProps } from "antd";
import {
  ClockCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  FileTextOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { InputRef } from "antd";
import { TodoItem } from "@/store/model/index.type";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");
import customParseFormat from "dayjs/plugin/customParseFormat";

export default function TodoCom(): JSX.Element {
  // todo data
  const [rowData, setRowData] = React.useState<TodoItem[]>([]);
  const [sortData, setSortData] = React.useState<TodoItem[]>([]);
  // drag function
  const dragData = React.useRef<TodoItem[]>([]);
  const dragRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<InputRef>(null);
  // edit AddTime AddContent Modal
  const [editCondition, setEditCondition] = React.useState<boolean>(false);
  const [editModal, setEditModal] = React.useState<boolean>(false);
  // addForm
  const [addTitle, setAddTitle] = React.useState<string>("");
  const [addTime, setAddTime] = React.useState<string>("");
  const [addContent, setAddContent] = React.useState<string>("");
  const [addLoading, setAddLoading] = React.useState<boolean>(false);

  const addSubmit = () => {
    if (!addTitle) {
      message.error("标题不能为空");
      return;
    }
    setAddLoading(true);
    api
      .addTodos({
        title: addTitle,
        content: addContent,
        time: addTime,
        status: "doing",
      })
      .then((res) => {
        console.log(res);
        message.success("添加成功");
        // setRowData([...rowData, res.data]);
        setSortData([...sortData, res.data]);
        dragData.current = [...dragData.current, res.data];
        setAddTitle("");
        setAddTime("");
        setAddContent("");
        setEditModal(false);
      })
      .finally(() => {
        setAddLoading(false);
      });
  };

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
      e.target === dragRef.current ||
      target === cloneObj ||
      e.currentTarget === cloneObj
    ) {
      return;
    }
    // 想要解决 动画没有结束前，太快的重新拖曳，将结点插入到了克隆元素内的bug，但未解决
    let listArray = Array.from(dragRef.current?.childNodes || []);
    let currentIndex = listArray.indexOf(currentDrag);
    let targetIndex = listArray.indexOf(e.currentTarget);
    let _RowData = [...dragData.current];
    [_RowData[currentIndex], _RowData[targetIndex]] = [
      _RowData[targetIndex],
      _RowData[currentIndex],
    ];
    dragData.current = _RowData;
    console.log("enter", dragData.current);
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
    const updateSorts = (data: TodoItem[]) => {
      // console.log("updateSorts", data);
      const form = data.map((item) => {
        if (item.id) return item.id.toString();
        else return "";
      });
      api.updateTodoSort(form).then((res) => {
        console.log(res);
        // setRowData(res.todoList);
      });
    };
    if (cloneNode) {
      var rect = e.currentTarget.getBoundingClientRect();
      var left = rect.left;
      var top = rect.top;
      updateSorts(dragData.current);
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
    e.preventDefault();
  };
  const blur = (e: any) => {
    if (addTitle || editModal) {
      return;
    }
    e.target.placeholder = "新建一个待办";
    setEditCondition(false);
  };
  const focus = (e: any) => {
    e.target.placeholder = "";
    setEditCondition(true);
  };

  const getTodoItem = () => {
    api.getTodos().then((res) => {
      // console.log(res);
      setRowData(res.todoList);
      dragData.current = res.todoList;
      api.getTodoSort().then((res) => {
        // console.log("rowData", dragData.current);
        const sortArr = res.data;
        const sortMap = new Map();
        dragData.current.forEach((item) => {
          if (item.id) sortMap.set(item.id.toString(), item);
        });
        // console.log("sortMap", sortMap);
        const data = sortArr.map((item) => {
          return sortMap.get(item);
        });
        // console.log("getSorted", data);
        setSortData(data);
        dragData.current = data;
      });
    });
  };
  useEffect(() => {
    inputRef.current?.nativeElement?.addEventListener("blur", blur);
    inputRef.current?.nativeElement?.addEventListener("focus", focus);
    return () => {
      inputRef.current?.nativeElement?.removeEventListener("blur", blur);
      inputRef.current?.nativeElement?.removeEventListener("focus", focus);
    };
  }, [addTitle, editModal]);

  useEffect(() => {
    getTodoItem();
  }, []);
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
          prefix={
            <PrefixButton
              condition={editCondition}
              loading={addLoading}
              submit={addSubmit}
            />
          }
          suffix={
            <SuffixButton
              condition={editCondition}
              setCondition={setEditCondition}
              setModal={setEditModal}
              setClock={setAddTime}
              clock={addTime}
              setContent={setAddContent}
              content={addContent}
            />
          }></Input>
      </div>
      <div className="todo-card-container" ref={dragRef}>
        {sortData.map((item) => {
          return (
            <div
              key={item?.id}
              className="todo-card"
              draggable
              onDrag={drag}
              onDragStart={dragStart}
              onDragOver={dragOver}
              onDragEnter={dragEnter}
              onDrop={drop}
              onDragEnd={dragEnd}>
              <div>{item?.title}</div>
              <div>{item?.content}</div>
              <div>{item?.id}</div>
              <div>{item?.status}</div>
              <button>11</button>
            </div>
          );
        })}
      </div>
    </>
  );
}

// function AddTodo(): JSX.Element {
//   return <></>;
// }

function PrefixButton({
  condition,
  loading,
  submit,
}: {
  condition: boolean;
  loading: boolean;
  submit: Function;
}) {
  return (
    <>
      <Button
        type="text"
        className="add-edit-button"
        loading={loading}
        onClick={() => submit()}
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
  setClock,
  clock,
  setContent,
  content,
}: {
  condition: boolean;
  setCondition: Function;
  setModal: Function;
  setClock: Function;
  clock: string;
  setContent: Function;
  content: string;
}) {
  const [clockModal, setClockModal] = React.useState<boolean>(false);
  const [contentModal, setContentModal] = React.useState<boolean>(false);

  const [datePickerValue, setDatePickerValue] = React.useState<string | null>(
    null
  );
  const [inputValue, setInputValue] = React.useState<string>("");
  const setTodoTime = () => {
    setModal(true);
    setClockModal(true);
    if (contentModal) {
      setContentModal(false);
    }
  };
  const confirmClock: PopconfirmProps["onConfirm"] = () => {
    setClock(datePickerValue);
    setModal(false);
    setClockModal(false);
  };
  const cancelClock: PopconfirmProps["onCancel"] = () => {
    setModal(false);
    setClockModal(false);
  };
  const confirmContent: PopconfirmProps["onConfirm"] = () => {
    setContent(inputValue);
    setModal(false);
    setContentModal(false);
  };
  const cancelContent: PopconfirmProps["onCancel"] = () => {
    setModal(false);
    setContentModal(false);
  };
  //防止点击按钮时，输入框失去焦点后无法显示PopConfirm组件
  const setTodoContent = () => {
    setModal(true);
    setContentModal(true);
    if (clockModal) {
      setClockModal(false);
    }
  };

  function DatePickerCom(): JSX.Element {
    type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

    dayjs.extend(customParseFormat);

    const range = (start: number, end: number) => {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    };

    const disabledDate: RangePickerProps["disabledDate"] = (current) => {
      // Can not select days before today
      return current && current < dayjs().startOf("day");
    };

    const disabledDateTime = (current: any) => {
      if (dayjs(current).format("YYYY-MM-DD") == dayjs().format("YYYY-MM-DD")) {
        const hour = dayjs().hour();
        const minute = dayjs().minute();
        if (
          dayjs(current).format("YYYY-MM-DD HH") ==
          dayjs().format("YYYY-MM-DD HH")
        ) {
          return {
            disabledHours: () => range(0, hour),
            disabledMinutes: () => range(0, minute),
          };
        } else {
          return {
            disabledHours: () => range(0, hour),
            disabledMinutes: () => range(60, 60),
          };
        }
      }
      return {
        disabledHours: () => range(24, 24),
        disabledMinutes: () => range(60, 60),
      };
    };

    return (
      <>
        <DatePicker
          format="YYYY-MM-DD HH:mm"
          disabledDate={disabledDate}
          disabledTime={disabledDateTime}
          // value={datePickerValue}
          onChange={(date, dateString) => {
            setDatePickerValue(dateString as string);
          }}
        />
      </>
    );
  }

  function InputCom(): JSX.Element {
    return (
      <>
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 6 }}
          placeholder="输入待办详细内容"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}></Input.TextArea>
      </>
    );
  }

  return (
    <>
      {condition && (
        <>
          {clock && (
            <Tag
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              onClick={() => {
                setTodoTime();
              }}
              icon={<ClockCircleOutlined />}
              closeIcon={<CloseCircleOutlined />}
              onClose={() => {
                setClock(null);
                setDatePickerValue(null);
              }}>
              {clock}
            </Tag>
          )}
          {content && (
            <Tag
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              onClick={() => {
                setTodoContent();
              }}
              icon={<FileTextOutlined />}
              closeIcon={<CloseCircleOutlined />}
              onClose={() => {
                setContent(null);
                setInputValue("");
              }}>
              {content}
            </Tag>
          )}

          <Popconfirm
            title="选择待办截止时间"
            description={DatePickerCom()}
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
            title="编辑待办详细内容"
            description={InputCom()}
            open={contentModal}
            onConfirm={confirmContent}
            onCancel={cancelContent}
            icon={<FileTextOutlined style={{ color: "var(--color)" }} />}
            okText="确认"
            cancelText="取消">
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
