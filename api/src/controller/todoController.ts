import { Response } from "express";
import { Request } from "../express";
import { todoRepository } from "../repository";
import { verifyToken } from "../utils/auth";
import { User } from "../entity/User";
import { Menu } from "../entity/Menu";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

const SignKey = process.env.JWT_SECRET as string;

export class TodoController {
  static async getEvents(req: Request, res: Response) {
    let result: Object;
    const token: string = req.headers["authorization"].split(" ")[1] as string;
    try {
      const user: any = jwt.verify(token, SignKey);
      result = await todoRepository.getEvents(user.id);
    } catch (error) {
      res.status(200).send({ message: "获取事件失败 " + error, code: 401 });
      return;
    }
    res.status(200).send(result);
  }
  static async updateEvents(req: Request, res: Response) {
    try {
      const { id } = verifyToken(req) as User;
      const data = req.body.eventList;
      const result = await todoRepository.updateEvents(id, data);
      res.status(200).send(result);
    } catch (error) {
      res.status(200).send({ message: "添加事件失败 " + error, code: 401 });
    }
  }
}
