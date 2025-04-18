import * as api from "@/api/todo";
import { Todo, Event } from "./index.type";
import { Dispatch } from "@/store";

import { getEvents, getTodos, saveEvents, saveTodos } from "@/utils/tools";

const todoState: Todo = {
  eventList: [],
  todoList: [],
};

export default {
  state: todoState,
  reducers: {
    setSetting: (state: Todo, payload: Todo) => {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch: Dispatch) => ({
    async saveTodo(data: TodoItem[]) {
      try {
        saveTodos(data);
        const result = await api.updateTodos(data);
        if (result.code === 200) {
          dispatch.todo.saveTodo(data);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async saveEvent(data: Event[]) {
      try {
        saveEvents(data);
        const result = await api.updateEvents(data);
        if (result.code === 200) {
          dispatch.todo.saveEvent(data);
        }
      } catch (error) {
        console.log(error);
      }
    },
  }),
};
