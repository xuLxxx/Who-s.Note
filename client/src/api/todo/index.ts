import type { Event } from "@/store/model/index.type";
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

export const addEvents = async (data: Event) => {
  const config = {
    url: "/todo/addEvents",
    method: "post",
    data,
  };
  return server.requestT<{ data: Event }>(config);
};

export const updateEvents = async (id: string, data: Event) => {
  const config = {
    url: `/todo/${id}/updateEvents`,
    method: "put",
    data,
  };
  return server.requestT<{ data: Event }>(config);
};

export const deleteEvents = async (id: string) => {
  const config = {
    url: `/todo/${id}/deleteEvents`,
    method: "delete",
  };
  return server.requestT<{ data: Event }>(config);
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
