import type { Menu } from "@/api/system/menu";
import type { LRUCache } from "@/utils/LRUCache";

export type UserInfo = {
  username?: string;
  password?: string;
  token?: string;
  role?: string;
  exp?: number;
  iat?: number;
  id: number | null;
};

export type Setting = {
  menu: Menu[];
  collapse: boolean;
  theme: "light" | "dark";
};

export type Todo = {
  eventList: Event[];
  todoList: TodoItem[];
};

export type ReduxCache = {
  userCache: LRUCache;
};

export interface Event {
  id?: number;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  extendedProps: {
    [key: string]: any;
    reStyle: boolean;
  };
  createAt?: string;
  updateAt?: string;
}
export interface TodoItem {
  id?: number;
  title: string;
  content: string;
  status: string;
  time: string;
  userId?: number;
  createAt?: string;
  updateAt?: string;
}
