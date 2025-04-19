import * as api from "@/api/todo";
import { Todo, Event } from "./index.type";
import { Dispatch, RootState } from "@/store";
import { message } from "antd";
import { getEvents, getTodos, saveEvents, saveTodos } from "@/utils/tools";

const todoState: Todo = {
  eventList: [],
  todoList: [],
};

export default {
  state: todoState,
  reducers: {
    addEvent: (state: Todo, payload: Event) => {
      const eventList = [...state.eventList, payload];
      return { ...state, eventList };
    },
    saveEvent: (state: Todo, payload: Event[]) => {
      return { ...state, eventList: payload };
    },
    update: (state: Todo, payload: Event) => {
      const eventList = state.eventList.map((item) => {
        if (item.id === payload.id) {
          return payload;
        } else {
          return item;
        }
      });
      return { ...state, eventList };
    },
    deleteEvent: (state: Todo, payload: Event) => {
      const eventList = state.eventList.filter(
        (item) => item.id !== payload.id
      );
      return { ...state, eventList };
    },
  },
  effects: (dispatch: Dispatch) => ({
    async addEvents(data: Event) {
      try {
        const result = await api.addEvents(data);
        if (result.code === 200) {
          message.success("添加成功");
          dispatch({ type: "todo/addEvent", payload: result.data });
          return result;
        } else {
          message.error(result.message);
          return result;
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    async getEvents() {
      try {
        const result = await api.getEvents();
        if (result.code === 200) {
          dispatch({ type: "todo/saveEvent", payload: result.data });
          return result;
        } else {
          message.error(result.message);
          return result;
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    async deleteEvents(id: string) {
      try {
        const result = await api.deleteEvents(id);
        if (result.code === 200) {
          message.success("删除成功");
          dispatch({ type: "todo/deleteEvent", payload: result.data });
          return result;
        } else {
          message.error(result.message);
          return result;
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    async updateEvents(data: Event) {
      try {
        const { id } = data as { id: number };
        const result = await api.updateEvents(id.toString(), data);
        if (result.code === 200) {
          message.success("更新成功");
          dispatch({ type: "todo/update", payload: result.data });
          return result;
        } else {
          message.error(result.message);
          return result;
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    },
  }),
};
