import { Repository } from "typeorm";
import { Todo, TodoContainer } from "../entity/Todo";
import { Event } from "../entity/Event";

export default class TodoService {
  constructor(
    private todoContainerRepository: Repository<TodoContainer>,
    private eventRepository: Repository<Event>,
    private todoRepository: Repository<Todo>
  ) {}
  async getTodos(id: number) {
    const result = await this.todoContainerRepository.findOne({
      where: { userId: id },
      relations: ["todoList", "eventList"], // 确保加载 todoList 和 eventList 关系
    });
    return result;
  }
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
  async addTodos(id: number, todo: Todo) {
    try {
      const result = await this.todoContainerRepository.findOne({
        where: { userId: id },
        relations: ["todoList"], // 确保加载 todoList 关系
      });
    } catch (error) {
      console.log(error);
      return { code: 500, message: "Internal server error" };
    }
  }
  async deleteTodos(id: number) {
    try {
      const result = await this.todoContainerRepository.delete({ id }); // 直接使用 delete 方法删除指定 id 的事件
      if (result.affected === 0) {
        return { code: 500, message: "Event not found" }; // 如果没有找到事件，返回 500 状态码
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
      // const result = await this.todoContainerRepository.findOne({
      //   where: { userId: id },
      //   relations: ["eventList"], // 确保加载 eventList 关系
      // });
      // console.log(result, "result");
      // const saveEvent = async (
      //   events: Event[],
      //   todoContainer: TodoContainer
      // ) => {
      //   let array = [];
      //   events.forEach(async (item) => {
      //     // const event = new Event(); // 创建新的 Event 实体
      //     console.log(id);
      //     const event = this.eventRepository.create({
      //       // userId: id, // 设置 userId 属性
      //       title: item.title, // 设置 title 属性
      //       start: item.start, // 设置 start 属性
      //       end: item.end, // 设置 end 属性
      //       allDays: item.allDays, // 设置 allDays 属性
      //       backgroundColor: item.backgroundColor, // 设置 backgroundColor 属性
      //       borderColor: item.borderColor, // 设置 borderColor 属性
      //       textColor: item.textColor, // 设置 textColor 属性
      //       extendedProps: item.extendedProps, // 设置 extendedProps 属性
      //       todoContainer, // 设置 todoContainer 属性
      //     }); // 创建新的 Event 实体
      //     console.log(event);
      //     await this.eventRepository.save(event);
      //     array.push(event); // 将新的 Event 实体添加到数组中
      //   });
      //   return array;
      // };
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
      // console.log("result", result);
      // if (!result) {
      //   const todoContainer = this.todoContainerRepository.create({
      //     userId: id, // 设置 userId 属性
      //   }); // 创建新的 TodoContainer 实体
      //   // todoContainer.userId = id;
      //   await this.todoContainerRepository.save(todoContainer); // 保存新的 TodoContainer 实体
      //   await saveEvent(events, todoContainer); // 直接将 events 数组赋值给 eventList
      //   console.log("todoContainer", todoContainer);
      // await this.todoContainerRepository.save(todoContainer); // 保存新的 TodoContainer 实体
      // const data = await this.todoContainerRepository // ormconfig.jsonで定義したDBに接続する。今回はpostgresだけだが、複数のDBに接続している場合は、今回接続するDB名を第一引数にを明示する
      //   .createQueryBuilder("u") // 第一引数はテーブル名、第二引数はそのalias
      //   .leftJoinAndSelect("u.eventList", "eventList")
      //   .getOne();
      // } else {
      // await this.eventRepository.remove(result.eventList); // 移除 TodoContainer 实体
      // await this.todoContainerRepository.remove(result); // 移除 TodoContainer 实体
      // const todoContainer = this.todoContainerRepository.create(); // 创建新的 TodoContainer 实体
      // todoContainer.userId = id;
      // await this.todoContainerRepository.save(todoContainer); // 保存新的 TodoContainer 实体
      // await saveEvent(events, todoContainer);

      // 直接将 events 数组赋值给 eventList
      // await this.todoContainerRepository.save(todoContainer); // 保存新的 TodoContainer 实体
      // const data = this.getEvents(id);
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

// 保存字符串的方法
//  async updateEvents(id: number, events: Event[]) {
//     try {
//       for (const event of events) {
//         event.extendedProps = JSON.stringify(event.extendedProps);
//         if (
//           !event.title ||
//           !event.start ||
//           !event.end ||
//           !event.backgroundColor ||
//           !event.borderColor ||
//           !event.textColor
//         ) {
//           return { code: 500, message: "更新失败,字段错误" };
//         }
//       }
//       const result = await this.todoContainerRepository.findOne({
//         where: { userId: id },
//       });
//       if (!result) {
//         const todoContainer = new TodoContainer();
//         todoContainer.userId = id;
//         todoContainer.todoList = "[]";
//         todoContainer.eventList = JSON.stringify(events);
//         const newResult = await this.todoContainerRepository.save(
//           todoContainer
//         );
//         return { code: 200, message: "创建成功", data: newResult };
//       } else {
//         result.eventList = JSON.stringify(events);
//         const newResult = await this.todoContainerRepository.save(result);
//         return { code: 200, message: "更新成功", data: newResult };
//       }
//     } catch (error) {
//       console.log(error);
//       return { code: 500, message: "更新失败" };
//     }
//   }

//   async getEvents(id: number) {
//     const result = await this.todoContainerRepository.findOne({
//       where: { userId: id },
//     });
//     if (!result) {
//       return { code: 500, message: "获取失败" };
//     }
//     const data = [];
//     for (const event of JSON.parse(result.eventList)) {
//       event.extendedProps = JSON.parse(event.extendedProps);
//       data.push(event);
//     }
//     return {
//       code: 200,
//       message: "获取成功",
//       data,
//     };
//   }
//   async getTodos(id: number) {
//     const result = await this.todoContainerRepository.findOne({
//       where: { userId: id },
//     });
//     if (!result) {
//       return null;
//     }
//     return result.todoList;
//   }
