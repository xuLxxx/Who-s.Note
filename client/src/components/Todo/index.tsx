import React, {
  Dispatch,
  DragEventHandler,
  memo,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

import * as api from "@/api/todo";

import "./index.less";
import "./index.type";
import {
  Button,
  Card,
  DatePicker,
  Drawer,
  Empty,
  Flex,
  Input,
  message,
  Popconfirm,
  Tag,
  Tooltip,
} from "antd";
import type { GetProps, PopconfirmProps } from "antd";
import {
  BorderOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import type { InputRef } from "antd";
import { TodoItem } from "@/store/model/index.type";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");
import customParseFormat from "dayjs/plugin/customParseFormat";
import Icon from "../Icon";

export default function TodoCom(): JSX.Element {
  // todo data
  const [rowData, setRowData] = useState<TodoItem[]>([]);
  const [sortData, setSortData] = useState<TodoItem[]>([]);
  // sort data
  const sorts = useRef<number[]>([]);
  // const sortMap = useRef<Record<string, number>>({});
  // drag function
  const dragData = React.useRef<TodoItem[]>([]);
  const dragRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<InputRef>(null);
  // edit AddTime AddContent Modal
  const [editCondition, setEditCondition] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  // addForm
  const [addTitle, setAddTitle] = useState<string>("");
  const [addTime, setAddTime] = useState<string>("");
  const [addContent, setAddContent] = useState<string>("");
  const [addLoading, setAddLoading] = useState<boolean>(false);
  //sort Funtion
  const [sortFunction, setSortFunction] = useState<
    Record<string, number | string>
  >({
    star: 2,
    start: "",
    end: "",
    status: 2,
  });

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
        stara: false,
      })
      .then((res) => {
        console.log(res);
        message.success("添加成功");
        // setRowData([...rowData, res.data]);
        setSortData([...sortData, res.data]);
        setRowData([...rowData, res.data]);
        dragData.current = [...dragData.current, res.data];
        sorts.current = [...sorts.current, res.data.id!];
        // sortMap.current[res.data.id!] = 1;
        updateSorts(dragData.current);
        setAddTitle("");
        setAddTime("");
        setAddContent("");
        setEditModal(false);
      })
      .finally(() => {
        setAddLoading(false);
      });
  };
  const updateRecord = (form: TodoItem) => {
    api.updateTodos(form).then((res) => {
      console.log(res);
      if (res.code === 200) {
        message.success("更新成功");
        const newData = sortData.map((item) => {
          if (item.id === form.id) {
            return res.data;
          } else {
            return item;
          }
        });
        const updateRowData = rowData.map((item) => {
          if (item.id === form.id) {
            return res.data;
          } else {
            return item;
          }
        });
        setSortData(newData);
        setRowData(updateRowData);
        dragData.current = newData;
      }
    });
  };
  const deleteRecord = (id: number) => {
    api.deleteTodos(id.toString()).then((res) => {
      console.log(res);
      if (res.code === 200) {
        message.success("删除成功");
        // let newSort: number[] = [];
        const newData = sortData.filter((item) => {
          if (item.id != id) {
            return item;
          }
        });
        setSortData(newData);
        setRowData(newData);
        sorts.current = sorts.current.filter((item) => {
          if (item != id) {
            return item;
          }
        });
        // for (const key in sortMap.current) {
        //   if (Object.prototype.hasOwnProperty.call(sortMap.current, key)) {
        //     const element = sortMap.current[key];
        //     if (element == id) {
        //       delete sortMap.current[key];
        //     }
        //   }
        // }
        dragData.current = newData;
        updateSorts(dragData.current);
      } else {
        message.error("删除失败");
      }
    });
  };

  let currentDrag: EventTarget & HTMLDivElement;
  var img = new Image();
  img.src =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cpath /%3E%3C/svg%3E";
  // let root = document.getElementById("root");
  let root = document.body;
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
    // console.log("enter", dragData.current);
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
  const updateSorts = (data: TodoItem[]) => {
    // console.log("updateSorts", data);
    let index = 0;
    const nowSorts = data.map((item) => {
      if (item.id) return item.id;
      else return "";
    });
    const form = sorts.current.map((id) => {
      if (nowSorts.includes(id)) {
        return nowSorts[index++].toString();
      } else {
        return id.toString();
      }
    });
    // console.log("nowSorts", nowSorts);
    // console.log("currentData", data);
    // console.log("sorts", sorts.current);
    // console.log("form", form);
    api.updateTodoSort(form).then((res) => {
      console.log(res);
      // setRowData(res.todoList);
    });
  };
  const dragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (cloneNode) {
      var rect = e.currentTarget.getBoundingClientRect();
      var left = rect.left;
      var top = rect.top;
      updateSorts(dragData.current);
      reset = cloneNode.animate(
        [
          { transform: cloneNode.style.transform }, // 起点
          { transform: "translate3d(" + left + "px," + top + "px,0)" }, // 终点
        ],
        {
          duration: 150,
          easing: "ease-in-out",
        }
      );
      reset.onfinish = function () {
        cloneObj && cloneNode.removeChild(cloneObj);
        root?.removeChild(cloneNode);
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
        let sortsArray = [] as number[];
        const sortArr = res.data;
        const sortMap = new Map();
        dragData.current.forEach((item) => {
          if (item.id) sortMap.set(item.id.toString(), item);
        });
        // console.log("sortMap", sortMap);
        const data = sortArr.map((item) => {
          sortsArray.push(+item);
          return sortMap.get(item);
        });
        // console.log("getSorted", data);
        sorts.current = sortsArray;
        setRowData(data);
        setSortData(data);
        dragData.current = data;
      });
    });
  };
  // 4.30 发现问题
  // 反复进行添加、解除监听事件，相当影响性能
  // 解决：
  // useReducer将focus和blur事件触发的行为剥离出来。
  // 逻辑封装在一个函数中，然后在useEffect中只监听一次，这样就可以避免反复进行添加、解除监听事件，提高性能。
  useEffect(() => {
    inputRef.current?.nativeElement?.addEventListener("blur", blur);
    inputRef.current?.nativeElement?.addEventListener("focus", focus);
    return () => {
      inputRef.current?.nativeElement?.removeEventListener("blur", blur);
      inputRef.current?.nativeElement?.removeEventListener("focus", focus);
    };
  }, [addTitle, editModal]);
  // 最初为了避免闭包陷阱，可以将依赖的状态或 props 添加到 useEffect 的依赖数组中，这样每次状态更新时，useEffect 都会重新运行，闭包中的值也会更新。

  useEffect(() => {
    const { star, start, end, status } = sortFunction;
    // if (!dragData.current.length) return;
    dragData.current = rowData;
    let newData = dragData.current.filter((item) => {
      if (star === 0 && item.stara === false) {
        return item;
      } else if (star === 1 && item.stara === true) {
        return item;
      } else if (star === 2) {
        return item;
      }
    }) as TodoItem[];
    if (!newData.length) return;
    // console.log("newData", newData);
    newData = newData.filter((item) => {
      if (status === 0 && item.status === "doing") {
        return item;
      } else if (status === 1 && item.status === "completed") {
        return item;
      } else if (status === 2) {
        return item;
      }
    }) as TodoItem[];
    setSortData(newData);
    dragData.current = newData;
  }, [sortFunction]);

  useEffect(() => {
    getTodoItem();
  }, []);
  return (
    <>
      <div className="todo-title">待办列表</div>
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
      <div>
        <FliterCom
          sortFunction={sortFunction}
          setSortFunction={setSortFunction}></FliterCom>
      </div>
      <div className="todo-card-container" ref={dragRef}>
        {sortData.map((item) => {
          return (
            <TodoRecord
              key={item.id}
              item={item}
              updateRecord={updateRecord}
              deleteRecord={deleteRecord}
              drag={drag}
              dragStart={dragStart}
              dragEnd={dragEnd}
              dragEnter={dragEnter}></TodoRecord>
          );
        })}
        {sortData.length === 0 && (
          <>
            <Empty />
          </>
        )}
      </div>
    </>
  );
}

const FliterCom = ({
  sortFunction,
  setSortFunction,
}: {
  sortFunction: Record<string, number | string>;
  // 0： star 0 非星标 1 星标 2 全部
  // 1： finish 0 未完成 1 完成 2 全部
  // 2： 筛选时间
  setSortFunction: Dispatch<SetStateAction<Record<string, number | string>>>;
}): JSX.Element => {
  const constant = {
    star: ["未标星", "标星", "全部"],
    starIcon: [<StarOutlined />, <StarFilled />, <BorderOutlined />],
    statusIcon: [
      <Icon type="icon-yuanxingweixuanzhong" style={{ fontSize: 24 }}></Icon>,
      <Icon type="icon-yuanxingxuanzhong" style={{ fontSize: 24 }}></Icon>,
      <Icon type="icon-tongzhi" style={{ fontSize: 24 }}></Icon>,
    ],
    status: ["未完成", "完成", "全部"],
  };
  // console.log("sortFunction", sortFunction);
  return (
    <>
      <Flex style={{ marginTop: 10 }}>
        <span>
          <Tooltip title={constant.star[sortFunction.star as number]}>
            <Button
              icon={constant.starIcon[sortFunction.star as number]}
              onClick={() => {
                let star = sortFunction.star as number;
                star = star === 2 ? 0 : star + 1;
                setSortFunction({ ...sortFunction, star });
              }}
              type="text"
              styles={{
                icon: {
                  color: "var(--color)",
                  fontSize: "20px",
                },
              }}></Button>
          </Tooltip>
        </span>
        <span>
          <Tooltip title={constant.status[sortFunction.status as number]}>
            <Button
              icon={constant.statusIcon[sortFunction.status as number]}
              onClick={(e) => {
                e.stopPropagation();
                let status = sortFunction.status as number;
                status = status === 2 ? 0 : status + 1;
                setSortFunction({ ...sortFunction, status });
              }}
              type="text"
              styles={{
                icon: {
                  color: "var(--color)",
                  fontSize: "20px",
                },
              }}></Button>
          </Tooltip>
        </span>
      </Flex>
    </>
  );
};

const DrawerCom = memo(function DrawerCom({
  data,
  view,
  updateRecord,
  close,
}: {
  data: TodoItem;
  view: boolean;
  updateRecord: (form: TodoItem) => void;
  close: () => void;
}): JSX.Element {
  const [editTitle, setEditTitle] = useState<string>(data.title);
  const [editTime, setEditTime] = useState<string | null>(data.time || null);
  const [editContent, setEditContent] = useState<string>(data.content);

  function Footer() {
    return (
      <>
        <Flex gap={12} justify="center">
          <span className="todo-card-text">
            <ClockCircleOutlined />{" "}
          </span>
          <span className="todo-card-text">
            创建日期：
            {dayjs(data?.createdAt).format("YYYY-MM-DD HH:mm:ss")}
          </span>{" "}
        </Flex>
      </>
    );
  }

  return (
    <>
      <Drawer
        title={
          <TitleCom
            item={data}
            key={data.id}
            inline={true}
            updateRecord={updateRecord}></TitleCom>
        }
        footer={Footer()}
        placement={"right"}
        closable={false}
        onClose={close}
        open={view}
        key={"right"}>
        <Flex vertical gap={5}>
          <span>
            <span className="todo-drawer-content">详细内容</span>
            {/* <span className="todo-drawer-content" style={{ marginLeft: 2 }}>
              <InfoCircleOutlined />
            </span> */}
          </span>
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 6 }}
            placeholder="输入待办详细内容"
            value={editContent}
            onBlur={(e) => {
              updateRecord({
                ...data,
                content: editContent,
              });
            }}
            onChange={(e) => {
              setEditContent(e.target.value);
            }}></Input.TextArea>
          <div>选择截止时间</div>
          <div>
            <DatePickerCom
              setDatePickerValue={setEditTime}
              datePickerValue={editTime}
              updateTime={(time: string) => {
                updateRecord({
                  ...data,
                  time: time,
                });
              }}
              editMode={true}></DatePickerCom>
          </div>
        </Flex>
      </Drawer>
    </>
  );
});

const TitleCom = memo(function TitleCom({
  item,
  inline,
  updateRecord,
}: {
  item: TodoItem;
  inline: boolean;
  updateRecord: (form: TodoItem) => void;
}) {
  return (
    <>
      {" "}
      <span className="todo-card-button">
        {" "}
        <Button
          type="text"
          styles={{ icon: { color: "var(--color)" } }}
          onClick={(e) => {
            e.stopPropagation();
            updateRecord({
              ...item,
              status: item?.status === "completed" ? "doing" : "completed",
            });
          }}
          icon={
            item?.status === "completed" ? (
              <Icon
                type="icon-yuanxingxuanzhong"
                style={{ fontSize: 24 }}></Icon>
            ) : (
              <Icon
                type="icon-yuanxingweixuanzhong"
                style={{ fontSize: 24 }}></Icon>
            )
          }></Button>
        {inline ? (
          <span
            className="todo-card-title"
            style={{
              textDecoration:
                item?.status === "completed" ? "line-through" : "",
            }}>
            {item?.title}
          </span>
        ) : (
          ""
        )}
      </span>
    </>
  );
});

/// 4.29 使用 memo 优化 TodoRecord 组件，减少不必要的渲染

const TodoRecord = memo(function TodoRecord({
  item,
  drag,
  dragStart,
  dragEnter,
  dragEnd,
  updateRecord,
  deleteRecord,
}: {
  item: any;
  drag: DragEventHandler<HTMLDivElement>;
  dragStart: DragEventHandler<HTMLDivElement>;
  dragEnter: DragEventHandler<HTMLDivElement>;
  dragEnd: DragEventHandler<HTMLDivElement>;
  updateRecord: (form: TodoItem) => void;
  deleteRecord: (id: number) => void;
}): JSX.Element {
  const [drawView, setDrawView] = useState(false);
  const openDrawer = (data: TodoItem) => {
    setDrawView(!drawView);
  };
  console.log("render");
  return (
    <>
      <DrawerCom
        data={item}
        view={drawView}
        updateRecord={updateRecord}
        close={() => setDrawView(false)}></DrawerCom>
      <div
        key={item?.id}
        className="todo-card"
        draggable
        onDrag={drag}
        onDragStart={dragStart}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={dragEnter}
        onDragEnd={dragEnd}
        onDrop={(e) => e.preventDefault()}>
        <div
          className="todo-card-flex"
          onClick={(e) => {
            e.stopPropagation();
            openDrawer(item);
          }}>
          <TitleCom
            item={item}
            key={item.id}
            inline={false}
            updateRecord={updateRecord}></TitleCom>
          {/* Completed */}
          <div>
            <span>
              <span
                className="todo-card-title"
                style={{
                  textDecoration:
                    item?.status === "completed" ? "line-through" : "",
                }}>
                {item?.title}
              </span>
              <div>
                <span>
                  {item?.content && (
                    <>
                      <span className="todo-card-text">
                        <FileTextOutlined />{" "}
                      </span>
                      <span className="todo-card-text">{item?.content}</span>{" "}
                    </>
                  )}
                </span>
                <span>
                  {item?.time && (
                    <>
                      <span className="todo-card-text">
                        <ClockCircleOutlined />{" "}
                      </span>
                      <span className="todo-card-text">
                        截止日期：
                        <span
                          style={{
                            color:
                              dayjs(item?.time).valueOf() > dayjs().valueOf()
                                ? ""
                                : "rgb(196, 86.4, 86.4)",
                          }}>
                          {item?.time}
                        </span>
                      </span>{" "}
                    </>
                  )}
                </span>
              </div>
            </span>
          </div>
          {/* left */}
          <div className="todo-card-right-flex">
            <Button
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                deleteRecord(item.id);
              }}
              color="danger"
              styles={{
                icon: {
                  fontSize: "20px",
                },
              }}
              variant="text"></Button>
            <Button
              icon={!item.stara ? <StarOutlined /> : <StarFilled />}
              onClick={(e) => {
                e.stopPropagation();
                let newItem = { ...item, stara: !item.stara };
                updateRecord(newItem);
              }}
              type="text"
              styles={{
                icon: {
                  color: "var(--color)",
                  fontSize: "20px",
                },
              }}></Button>

            <div>
              {item?.updatedAt && (
                <>
                  <span className="todo-card-text">
                    更新日期：
                    {dayjs(item?.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                  </span>{" "}
                  <span className="todo-card-text">
                    <ClockCircleOutlined />{" "}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

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

function DatePickerCom({
  setDatePickerValue,
  datePickerValue,
  editMode,
  updateTime,
}: {
  setDatePickerValue: Dispatch<SetStateAction<string | null>>;
  datePickerValue: string | null;
  editMode?: boolean;
  updateTime?: (time: string) => void;
}): JSX.Element {
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

  useEffect(() => {
    !editMode && setDatePickerValue(dayjs().format("YYYY-MM-DD HH:mm"));
  }, [editMode]);

  return (
    <>
      <DatePicker
        format="YYYY-MM-DD HH:mm"
        disabledDate={disabledDate}
        disabledTime={disabledDateTime}
        style={{ width: "100%" }}
        value={
          editMode
            ? datePickerValue
              ? dayjs(datePickerValue)
              : null
            : dayjs(datePickerValue || new Date())
        }
        onChange={(date, dateString) => {
          setDatePickerValue(dateString as string);
          if (updateTime) {
            updateTime(dateString as string);
          }
        }}
        showTime={{ defaultValue: dayjs() }}
      />
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
  const [clockModal, setClockModal] = useState<boolean>(false);
  const [contentModal, setContentModal] = useState<boolean>(false);

  const [datePickerValue, setDatePickerValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
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
            description={
              <DatePickerCom
                setDatePickerValue={setDatePickerValue}
                datePickerValue={datePickerValue}
                editMode={false}></DatePickerCom>
            }
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
