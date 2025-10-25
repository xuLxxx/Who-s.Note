import { Repository } from "typeorm";
import { Todo, TodoContainer, TodoSorts } from "../entity/Todo";
import { Event } from "../entity/Event";

export default class TodoService {
  constructor(
    private todoContainerRepository: Repository<TodoContainer>,
    private eventRepository: Repository<Event>,
    private todoRepository: Repository<Todo>,
    private todoSortRepository: Repository<TodoSorts>
  ) {}
  async getTodos(id: number) {
    const result = await this.todoContainerRepository.findOne({
      where: { userId: id },
      relations: ["todoList"], // 确保加载 todoList 关系
    });
    return result;
  }
  async updateTodos(id: number, todo: Todo) {
    try {
      const result = await this.todoContainerRepository.findOne({
        where: { userId: id },
        relations: ["todoList"], // 确保加载 todoList 关系
      });
      if (result) {
        const todoToUpdate = await this.todoRepository.findOne({
          where: { id: todo.id },
        }); // 查找要更新的 Todo 实体
        if (todoToUpdate) {
          todoToUpdate.title = todo.title; // 更新 title 属性
          todoToUpdate.content = todo.content; // 更新 content 属性
          todoToUpdate.time = todo.time; // 更新 time 属性
          todoToUpdate.status = todo.status; // 更新 status 属性
          todoToUpdate.stara = todo.stara; // 更新 stara 属性
          const data = await this.todoRepository.save(todoToUpdate); // 保存更新后的 Todo 实体
          return { code: 200, message: "Todo updated successfully", data }; // 返回成功响应
        }
      }
    } catch (error) {
      console.log(error);
      return { code: 500, message: "Internal server error" }; // 如果发生错误，返回 500 状态码
    }
  }
  async addTodos(id: number, todo: Todo) {
    try {
      const result = await this.todoContainerRepository.findOne({
        where: { userId: id },
        relations: ["todoList"], // 确保加载 todoList 关系
      });
      if (result) {
        const newTodo = this.todoRepository.create({
          title: todo.title, // 设置 title 属性
          content: todo.content, // 设置 content 属性
          time: todo.time, // 设置 time 属性
          status: todo.status, // 设置 status 属性
          stara: todo.stara, // 设置 stara 属性
          todoContainer: result, // 设置 todoContainer 属性
        });
        const _todo = await this.todoRepository.save(newTodo); // 保存新的 Todo 实体
        result.todoList.push(_todo); // 将新的 Todo 实体添加到数组中
        await this.todoContainerRepository.save(result); // 保存更新后的 todoContainer 实体
        return { code: 200, message: "Todo added successfully", data: newTodo }; // 返回成功响应
      } else {
        const todoContainer = new TodoContainer(); // 创建新的 TodoContainer 实体
        todoContainer.userId = id; // 设置 userId 属性
        todoContainer.todoList = []; // 设置 todoList 属性
        const newTodo = this.todoRepository.create({
          title: todo.title, // 设置 title 属性
          content: todo.content, // 设置 content 属性
          time: todo.time, // 设置 time 属性
          status: todo.status, // 设置 status 属性
          stara: todo.stara, // 设置 stara 属性
          todoContainer: result, // 设置 todoContainer 属性
        });
        const _todo = await this.todoRepository.save(newTodo); // 保存新的 Todo 实体
        todoContainer.todoList = [_todo]; // 设置 todoList 属性
        await this.todoContainerRepository.save(todoContainer); // 保存新的 todoContainer 实体
        return { code: 200, message: "Todo added successfully", data: _todo }; // 返回成功响应
      }
    } catch (error) {
      console.log(error);
      return { code: 500, message: "Internal server error" };
    }
  }
  async deleteTodos(id: number, userId: number) {
    try {
      const result = await this.todoRepository.delete({ id }); // 直接使用 delete 方法删除指定 id 的事件
      if (result.affected === 0) {
        return { code: 500, message: "Event not found" }; // 如果没有找到事件，返回 500 状态码
      } else {
        // let sort = await this.todoSortRepository.findOne({
        //   where: { userId },
        // });
        // console.log(sort);
        // sort?.sorts.filter((item) => item != id);
        // console.log(sort);
        // await this.todoSortRepository.save(sort);
        // this.todoSortRepository.delete({ userId: id });
        return {
          code: 200,
          message: "Event deleted successfully",
          data: result,
        }; // 如果删除成功，返回 200 状态码
      }
    } catch (error) {
      console.log(error);
      return { code: 500, message: "Internal server error" }; // 如果发生错误，返回 500 状态码
    }
  }
  async updateTodoSorts(id: number, sorts: number[]) {
    try {
      const result = await this.todoSortRepository.findOne({
        where: { userId: id },
      });
      if (result) {
        result.sorts = sorts; // 更新 sorts 属性
        await this.todoSortRepository.save(result); // 保存更新后的 TodoContainer 实体
      } else {
        const newTodoList = this.todoSortRepository.create({
          userId: id,
          sorts,
        }); // 创建新的 TodoContainer 实体
        await this.todoSortRepository.save(newTodoList); // 保存新的 TodoContainer 实体
      }
      return {
        code: 200,
        message: "TodoList updated successfully",
        data: sorts,
      }; // 返回成功响应
    } catch {
      return { code: 500, message: "Internal server error" };
    }
  }
  async getTodoSorts(id: number) {
    try {
      const result = (
        await this.todoSortRepository.findOne({
          where: { userId: id },
        })
      )?.sorts as any;
      console.log(result);
      // const data = JSON.parse(result).sorts;
      // console.log(data);
      return { code: 200, message: "Success", data: result };
    } catch {
      return { code: 500, message: "Internal server error" };
    }
  }
  //id: userId, events: Event
  async addEvents(id: number, event: Event) {
    try {
      const result = await this.todoContainerRepository.findOne({
        where: { userId: id },
        relations: ["eventList"], // 确保加载 eventList 关系
      });
      console.log(result, "result");
      if (result) {
        const newEvent = this.eventRepository.create({
          title: event.title, // 设置 title 属性
          start: event.start, // 设置 start 属性
          end: event.end, // 设置 end 属性
          allDay: event.allDay, // 设置 allDays 属性
          backgroundColor: event.backgroundColor, // 设置 backgroundColor 属性
          borderColor: event.borderColor, // 设置 borderColor 属性
          textColor: event.textColor, // 设置 textColor 属性
          extendedProps: event.extendedProps, // 设置 extendedProps 属性
          todoContainer: result, // 设置 todoContainer 属性
        });
        const _Event = await this.eventRepository.save(newEvent);
        result.eventList.push(_Event); // 将新的 Event 实体添加到数组中
        await this.todoContainerRepository.save(result); // 保存更新后的 todoContainer 实体
        return { code: 200, message: "Event added successfully", data: _Event }; // 返回成功响应
      } else {
        const todoContainer = new TodoContainer(); // 创建新的 TodoContainer 实体
        todoContainer.userId = id; // 设置 userId 属性
        todoContainer.todoList = []; // 设置 todoList 属性
        const newEvent = this.eventRepository.create({
          title: event.title, // 设置 title 属性
          start: event.start, // 设置 start 属性
          end: event.end, // 设置 end 属性
          allDay: event.allDay, // 设置 allDays 属性
          backgroundColor: event.backgroundColor, // 设置 backgroundColor 属性
          borderColor: event.borderColor, // 设置 borderColor 属性
          textColor: event.textColor, // 设置 textColor 属性
          extendedProps: event.extendedProps, // 设置 extendedProps 属性
          todoContainer: result, // 设置 todoContainer 属性
        });
        const _Event = await this.eventRepository.save(newEvent);
        todoContainer.eventList = [_Event]; // 设置 eventList 属性
        await this.todoContainerRepository.save(todoContainer); // 保存新的 todoContainer 实体
        return { code: 200, message: "Event added successfully", data: _Event }; // 返回成功响应
      }
    } catch (error) {
      console.log(error);
      return { code: 500, message: "Internal server error" };
    }
  }
  //id: eventId
  async deleteEvents(id: number) {
    try {
      const result = await this.eventRepository.delete({ id }); // 直接使用 delete 方法删除指定 id 的事件
      if (result.affected === 0) {
        return { code: 404, message: "Event not found" }; // 如果没有找到事件，返回 404 状态码
      } else {
        return {
          code: 200,
          message: "Event deleted successfully",
          data: result,
        }; // 如果删除成功，返回 200 状态码
      }
    } catch (error) {
      console.log(error);
      return { code: 500, message: "Internal server error" }; // 如果发生错误，返回 500 状态码
    }
  }
  // id: eventId, events: Event[]
  async updateEvents(id: number, event: Event) {
    try {
      const updateEvent = async (event: Event) => {
        console.log("updateEvent", event);

        const newEvent = await this.eventRepository.findOne({
          where: { id },
        });
        console.log(event);
        newEvent.title = event.title; // 设置 title 属性
        newEvent.start = event.start; // 设置 start 属性
        newEvent.end = event.end; // 设置 end 属性
        newEvent.allDay = event.allDay; // 设置 allDays 属性
        newEvent.backgroundColor = event.backgroundColor; // 设置 backgroundColor 属性
        newEvent.borderColor = event.borderColor; // 设置 borderColor 属性
        newEvent.textColor = event.textColor; // 设置 textColor 属性
        newEvent.extendedProps = event.extendedProps; // 设置 extendedProps 属性
        await this.eventRepository.save(newEvent);
        return newEvent;
      };
      const newEvent = await updateEvent(event);
      // }

      // const { data } = await this.getEvents(id);
      // console.log(data);
      return { code: 200, message: "更新成功", data: newEvent };
    } catch (error) {
      console.log(error);
      return { code: 500, message: "更新失败" };
    }
  }
  // userId を指定して Event を取得するメソッド
  async getEvents(id: number) {
    const result = await this.todoContainerRepository.findOne({
      where: { userId: id },
      relations: ["eventList"], // 确保加载 eventList 关系
    });
    console.log(result);
    if (!result) {
      return { code: 500, message: "获取失败" };
    }
    return { code: 200, message: "获取成功", data: result.eventList };
  }
}
