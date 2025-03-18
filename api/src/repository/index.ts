import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Menu } from "../entity/Menu";
import { File } from "../entity/File";
import { UserService } from "../service/userService";
import MenuService from "../service/menuService"; // export 与 export default 的区别
import { FileService } from "../service/fileService";

export const userRepository = new UserService(
  AppDataSource.getRepository(User)
);

export const menuRepository = new MenuService(
  AppDataSource.getRepository(Menu)
);

export const fileRepository = new FileService(
  AppDataSource.getRepository(File)
);
