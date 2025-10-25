import type { Event } from "@/store/model/index.type";
import server from "@/utils/request";
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
  return server.requestT<{ todoList: TodoItem[] }>(config);
};

//增加待办
export const addTodos = async (data: TodoItem) => {
  const config = {
    url: "/todo/addTodos",
    method: "post",
    data,
  };
  return server.requestT<{ data: TodoItem }>(config);
};

//添加待办
export const updateTodos = async (data: TodoItem) => {
  const config = {
    url: `/todo/updateTodos`,
    method: "put",
    data,
  };
  return server.requestT<{ data: TodoItem }>(config);
};

//删除待办
export const deleteTodos = async (id: string) => {
  const config = {
    url: `/todo/${id}/deleteTodos`,
    method: "delete",
  };
  return server.requestT<{ data: TodoItem[] }>(config);
};

//获取待办排序
export const getTodoSort = async () => {
  const config = {
    url: "/todo/sorts",
    method: "get",
  };
  return server.requestT<{ data: string[] }>(config);
};

//更新待办排序
export const updateTodoSort = async (data: string[]) => {
  const config = {
    url: "/todo/sorts",
    method: "put",
    data,
  };
  return server.requestT<{ data: string[] }>(config);
};
