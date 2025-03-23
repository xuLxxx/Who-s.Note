import { Repository } from "typeorm";
import { Setting } from "../entity/Setting";

export class SettingService {
  constructor(private settingRepository: Repository<Setting>) {}
  async getSetting() {
    const result = await this.settingRepository.find();
    return { code: 200, message: "success", data: result };
  }
}
