import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Menu } from "../entity/Menu";
import { File } from "../entity/File";
import { Setting } from "../entity/Setting";
import { Markdown } from "../entity/Markdown";

import { UserService } from "../service/userService";
import MenuService from "../service/menuService"; // export 与 export default 的区别
import { FileService } from "../service/fileService";
import { MdService } from "../service/mdService";
import { SettingService } from "../service/settingService";

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
