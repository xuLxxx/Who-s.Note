import { getConnection, Repository } from "typeorm";
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
      const result = await this.todoContainerRepository.findOne({
        where: { userId: id },
        relations: ["eventList"], // 确保加载 eventList 关系
      });
      //   const array = [];
      const saveEvent = (events: Event[], todoContainer: TodoContainer) => {
        const array = [];
        events.map(async (item) => {
          const event = new Event(); // 创建新的 Event 实体
          event.userId = id; // 设置 userId 属性
          event.title = item.title; // 设置 title 属性
          event.start = item.start; // 设置 start 属性
          event.end = item.end; // 设置 end 属性
          event.allDays = item.allDays; // 设置 allDays 属性
          event.backgroundColor = item.backgroundColor; // 设置 backgroundColor 属性
          event.borderColor = item.borderColor; // 设置 borderColor 属性
          event.textColor = item.textColor; // 设置 textColor 属性
          event.extendedProps = item.extendedProps; // 设置 extendedProps 属性
          todoContainer ? (event.todoContainer = todoContainer) : ""; // 设置 todoContainer 属性
          await this.eventRepository.save(event);
          array.push(event); // 将新的 Event 实体添加到数组中
        });
        return array;
      };
      console.log("result", result);
      if (!result.userId) {
        const todoContainer = this.todoContainerRepository.create(); // 创建新的 TodoContainer 实体
        todoContainer.userId = id;
        await this.todoContainerRepository.save(todoContainer); // 保存新的 TodoContainer 实体
        saveEvent(events, todoContainer); // 直接将 events 数组赋值给 eventList
        const data = await this.todoContainerRepository // ormconfig.jsonで定義したDBに接続する。今回はpostgresだけだが、複数のDBに接続している場合は、今回接続するDB名を第一引数にを明示する
          .createQueryBuilder("u") // 第一引数はテーブル名、第二引数はそのalias
          .leftJoinAndSelect("u.eventList", "eventList")
          .getMany();
        return { code: 200, message: "创建成功", data };
      } else {
        const todoContainer = this.todoContainerRepository.create(); // 创建新的 TodoContainer 实体
        todoContainer.userId = id;
        saveEvent(events, todoContainer); // 直接将 events 数组赋值给 eventList
        // await this.todoContainerRepository.save(todoContainer); // 保存新的 TodoContainer 实体
        // const data = this.getEvents(id);
        const data = await this.todoContainerRepository // ormconfig.jsonで定義したDBに接続する。今回はpostgresだけだが、複数のDBに接続している場合は、今回接続するDB名を第一引数にを明示する
          .createQueryBuilder("u") // 第一引数はテーブル名、第二引数はそのalias
          .leftJoinAndSelect("u.eventList", "eventList")
          .getMany();
        return { code: 200, message: "更新成功", data };
      }
    } catch (error) {
      console.log(error);
      return { code: 401, message: "更新失败" };
    }
  }
  async getEvents(id: number) {
    const result = await this.todoContainerRepository.findOne({
      where: { userId: id },
      relations: ["eventList"], // 确保加载 eventList 关系
    });
    if (!result) {
      return { code: 401, message: "获取失败" };
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
//           return { code: 401, message: "更新失败,字段错误" };
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
//       return { code: 401, message: "更新失败" };
//     }
//   }

//   async getEvents(id: number) {
//     const result = await this.todoContainerRepository.findOne({
//       where: { userId: id },
//     });
//     if (!result) {
//       return { code: 401, message: "获取失败" };
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
