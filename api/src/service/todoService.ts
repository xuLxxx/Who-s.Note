import { Repository } from "typeorm";
import { Todo, TodoContainer } from "../entity/Todo";
import { Event } from "../entity/Event";

export default class TodoService {
  constructor(
    private todoContainerRepository: Repository<TodoContainer>,
    private eventRepository: Repository<Event>,
    private todoRepository: Repository<Todo>
  ) {}
  async updateTodos(id: number, todos: Todo[]) {
    // const result = await this.todoContainerRepository.findOne({
    //   where: { userId: id },
    // });
    // if (!result) {
    //   const todoContainer = new TodoContainer();
    //   todoContainer.userId = id;
    //   todoContainer.todoList = todos;
    //   todoContainer.eventList = [];
    // } else {
    //   //   result.todoList.push(todo);
    // }
  }
  async updateEvents(id: number, events: Event[]) {
    try {
      for (const event of events) {
        event.extendedProps = JSON.stringify(event.extendedProps);
        if (
          !event.title ||
          !event.start ||
          !event.end ||
          !event.backgroundColor ||
          !event.borderColor ||
          !event.textColor
        ) {
          return { code: 401, message: "更新失败,字段错误" };
        }
      }
      const result = await this.todoContainerRepository.findOne({
        where: { userId: id },
      });
      if (!result) {
        const todoContainer = new TodoContainer();
        todoContainer.userId = id;
        todoContainer.todoList = "[]";
        todoContainer.eventList = JSON.stringify(events);
        const newResult = await this.todoContainerRepository.save(
          todoContainer
        );
        return { code: 200, message: "创建成功", data: newResult };
      } else {
        result.eventList = JSON.stringify(events);
        const newResult = await this.todoContainerRepository.save(result);
        return { code: 200, message: "更新成功", data: newResult };
      }
    } catch (error) {
      console.log(error);
      return { code: 401, message: "更新失败" };
    }
  }

  async getEvents(id: number) {
    const result = await this.todoContainerRepository.findOne({
      where: { userId: id },
    });
    if (!result) {
      return { code: 401, message: "获取失败" };
    }
    const data = [];
    for (const event of JSON.parse(result.eventList)) {
      event.extendedProps = JSON.parse(event.extendedProps);
      data.push(event);
    }
    return {
      code: 200,
      message: "获取成功",
      data,
    };
  }
  async getTodos(id: number) {
    const result = await this.todoContainerRepository.findOne({
      where: { userId: id },
    });
    if (!result) {
      return null;
    }
    return result.todoList;
  }
}
