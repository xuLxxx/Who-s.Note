import { Response, Request } from "express";
import { settingRepository } from "../repository";
import "dotenv/config";
// 暂时弃用。系统设置(主题、collaspe)在本地保存
const SignKey = process.env.JWT_SECRET as string;

export class SettingController {
  static async upload(req: Request, res: Response) {
    try {
    } catch (error) {
      res.status(400).send({ message: "上传失败  " + error, code: 400 });
      return;
    }
  }
  static async getSetting(req: Request, res: Response) {
    const result = await settingRepository.getSetting();
    res.status(200).send(result);
  }
}
