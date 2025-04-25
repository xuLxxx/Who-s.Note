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
      if (!user) {
        res.status(200).send({ message: "token过期", code: 401 });
        return;
      }
      result = await todoRepository.getEvents(user.id);
    } catch (error) {
      res.status(200).send({ message: "获取事件失败 " + error, code: 500 });
      return;
    }
    res.status(200).send(result);
  }
  static async updateEvents(req: Request, res: Response) {
    try {
      const user = verifyToken(req);
      if (!user) {
        res.status(200).send({ message: "token过期", code: 401 });
        return;
      }
      const id = +req.params.id;
      const data = req.body;
      const result = await todoRepository.updateEvents(id, data);
      res.status(200).send(result);
    } catch (error) {
      res.status(200).send({ message: "更新事件失败 " + error, code: 500 });
    }
  }
  static async deleteEvents(req: Request, res: Response) {
    try {
      const user = verifyToken(req);
      if (!user) {
        res.status(200).send({ message: "token过期", code: 401 });
        return;
      }
      const id = +req.params.id;
      const result = await todoRepository.deleteEvents(id);
      res.status(200).send(result);
    } catch (error) {
      res.status(200).send({ message: "删除事件失败 " + error, code: 500 });
    }
  }
  static async addEvents(req: Request, res: Response) {
    try {
      const { id } = verifyToken(req);
      if (!id) {
        res.status(200).send({ message: "token过期", code: 401 });
        return;
      }
      const data = req.body;
      const result = await todoRepository.addEvents(id, data);
      res.status(200).send(result);
    } catch (error) {
      res.status(200).send({ message: "添加事件失败 " + error, code: 500 });
    }
  }
  static async getTodos(req: Request, res: Response) {
    try {
      const { id } = verifyToken(req);
      if (!id) {
        res.status(200).send({ message: "token过期", code: 401 });
        return;
      }
      const result = await todoRepository.getTodos(id);
      res.status(200).send(result);
    } catch (error) {
      res.status(200).send({ message: "获取待办失败", code: 401 });
    }
  }
  static async addTodos(req: Request, res: Response) {
    try {
      const { id } = verifyToken(req);
      if (!id) {
        res.status(200).send({ message: "token过期", code: 401 });
        return;
      }
      const data = req.body;
      const result = await todoRepository.addTodos(id, data);
      res.status(200).send(result);
    } catch (error) {
      res.status(200).send({ message: "添加待办失败", code: 401 });
    }
  }
  static async updateTodos(req: Request, res: Response) {
    try {
      const { id } = verifyToken(req);
      if (!id) {
        res.status(200).send({ message: "token过期", code: 401 });
        return;
      }
      const data = req.body;
      const result = await todoRepository.updateTodos(id, data);
      res.status(200).send(result);
    } catch (error) {
      res.status(200).send({ message: "更新待办失败", code: 401 });
    }
  }
  static async deleteTodos(req: Request, res: Response) {
    try {
      const { id } = verifyToken(req);
      if (!id) {
        res.status(200).send({ message: "token过期", code: 401 });
        return;
      }
      const _id = +req.params.id;
      const result = await todoRepository.deleteTodos(_id);
      res.status(200).send(result);
    } catch (error) {
      res.status(200).send({ message: "删除待办失败", code: 401 });
    }
  }
}
