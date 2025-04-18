import { Setting } from "@/store/model/index.type";
import type { Event, TodoItem } from "@/store/model/index.type";

export function getSetting() {
  const r: Setting = JSON.parse(localStorage.getItem("setting") as string);
  return r;
}

export function setSetting(setting: Setting) {
  localStorage.setItem("setting", JSON.stringify(setting));
}

export function saveEvents(data: Event[]) {
  localStorage.setItem("events", JSON.stringify(data));
  return true;
}

export function getEvents() {
  const r: Event = JSON.parse(localStorage.getItem("events") as string);
  return r;
}

export function saveTodos(data: TodoItem[]) {
  localStorage.setItem("todo", JSON.stringify(data));
  return true;
}

export function getTodos() {
  const r: TodoItem = JSON.parse(localStorage.getItem("todo") as string);
  return r;
}
