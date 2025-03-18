import { Repository } from "typeorm";
import { Menu } from "../entity/Menu";

export default class MenuService {
  constructor(private menuRepository: Repository<any>) {}

  async getMenu(role: string) {
    let result: Object[] = [];
    let temp: Object[] = [];
    if (!role) {
      return { message: "参数错误", code: 400 };
    }
    switch (role) {
      case "admin":
        temp = await this.menuRepository.find({
          where: { role: "admin" },
        });
        // console.log("temp", typeof temp, typeof temp[0], typeof result);
        result = [...temp, ...result];
      case "user":
        temp = await this.menuRepository.find({
          where: { role: "user" },
        });
        result = [...temp, ...result];
    }
    return { code: 200, data: result || [], message: "success" };
  }

  async addMenu(menu: Menu) {
    if (
      !menu ||
      !menu.name ||
      !menu.sorts ||
      !menu.role ||
      !menu.conditions ||
      !menu.url ||
      !menu.title
    ) {
      return { message: "参数错误", code: 400 };
    }
    const item = this.menuRepository.create(menu);
    const result = await this.menuRepository.save(item);
    return { code: 200, message: "添加成功", data: result };
  }
}
