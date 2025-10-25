import { AppDataSource } from "../data-source";
import {
  Todo,
  TodoContainer,
  TodoSorts,
  Event,
  File,
  Setting,
  Markdown,
  User,
  Menu,
  Room,
  Message,
} from "../entity";

import { UserService } from "../service/userService";
import MenuService from "../service/menuService"; // export 与 export default 的区别
import { FileService } from "../service/fileService";
import { MdService } from "../service/mdService";
import { SettingService } from "../service/settingService";
import TodoService from "../service/todoService";
import { TalkService } from "../service/talkService";

// 数据源
export const userRepository = new UserService(
  AppDataSource.getRepository(User)
);

export const menuRepository = new MenuService(
  AppDataSource.getRepository(Menu)
);

export const fileRepository = new FileService(
  AppDataSource.getRepository(File)
);

export const mdRepository = new MdService(
  AppDataSource.getRepository(Markdown)
);

export const settingRepository = new SettingService(
  AppDataSource.getRepository(Setting)
);

export const todoRepository = new TodoService(
  AppDataSource.getRepository(TodoContainer),
  AppDataSource.getRepository(Event),
  AppDataSource.getRepository(Todo),
  AppDataSource.getRepository(TodoSorts)
);

export const talkRepository = new TalkService(
  AppDataSource.getRepository(Room),
  AppDataSource.getRepository(Message)
);
