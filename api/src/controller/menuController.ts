import { Response } from "express";
import { Request } from "../express";
import { menuRepository } from "../repository";
import { verifyToken } from "../utils/auth";
import { User } from "../entity/User";
import { Menu } from "../entity/Menu";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

const SignKey = process.env.JWT_SECRET as string;

export class MenuController {
  static async getMenu(req: Request, res: Response) {
    let result: Object;
    const token: string = req.headers["authorization"].split(" ")[1] as string;
    try {
      const user: any = jwt.verify(token, SignKey);
      result = await menuRepository.getMenu(user.role);
    } catch (error) {
      res.status(200).send({ message: "获取菜单失败 " + error, code: 401 });
      return;
    }
    res.status(200).send(result);
  }
  static async addMenu(req: Request, res: Response) {
    try {
      verifyToken(req);
      let data = new Menu();
      data = req.body;
      const result = await menuRepository.addMenu(data);
      res.status(200).send(result);
    } catch (error) {
      res.status(200).send({ message: "添加菜单失败 " + error, code: 401 });
    }
  }
}
