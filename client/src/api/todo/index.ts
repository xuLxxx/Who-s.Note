import type { Event } from "./index.type";
import { hashObject } from "@/utils/object";
import server from "@/utils/request";
import store from "@/store";
import { TodoItem } from "@/store/model/index.type";

//获取事件

export const getEvents = async () => {
  const config = {
    url: "/todo/getEvents",
    method: "get",
  };
  return server.requestT<{ data: Event[] }>(config);
};

//添加事件

export const updateEvents = async (data: Event[]) => {
  const config = {
    url: "/todo/updateEvents",
    method: "put",
    data,
  };
  return server.requestT<{ data: Event[] }>(config);
};

//获取待办
export const getTodos = async () => {
  const config = {
    url: "/todo/getTodos",
    method: "get",
  };
  return server.requestT<{ data: TodoItem[] }>(config);
};

//添加待办
export const updateTodos = async (data: TodoItem[]) => {
  const config = {
    url: "/todo/addTodos",
    method: "put",
    data,
  };
  return server.requestT<{ data: TodoItem[] }>(config);
};
