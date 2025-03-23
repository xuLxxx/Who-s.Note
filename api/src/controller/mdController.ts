import { Request, Response } from "express";
import { mdRepository } from "../repository";
import { User } from "../entity/User";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

const SignKey = process.env.JWT_SECRET as string;

export class MdController {
  static async saveMarkdown(req: Request, res: Response) {
    try {
      const token: string = req.headers["authorization"].split(
        " "
      )[1] as string;
      const user: any = jwt.verify(token, SignKey);
      const result = await mdRepository.saveMarkdown(req.body, user);
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ message: "保存失败 " + error, code: 400 });
    }
  }
  static async getUserAllMarkdown(req: Request, res: Response) {
    try {
      const token: string = req.headers["authorization"].split(
        " "
      )[1] as string;
      const user: any = jwt.verify(token, SignKey);
      const result = await mdRepository.getUserAllMarkdown(user);
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ message: "获取失败 " + error, code: 400 });
    }
  }
  static async getUserMarkdownByid(req: Request, res: Response) {
    try {
      const token: string = req.headers["authorization"].split(
        " "
      )[1] as string;
      const user: any = jwt.verify(token, SignKey);
      const result = await mdRepository.getUserMarkdownByid(
        Number(req.params.id),
        user
      );
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ message: "获取失败 " + error, code: 400 });
    }
  }
  static async deleteUserMarkdown(req: Request, res: Response) {
    try {
      const token: string = req.headers["authorization"].split(
        " "
      )[1] as string;
      const user: any = jwt.verify(token, SignKey);
      const result = await mdRepository.deleteUserMarkdown(
        Number(req.params.id),
        user
      );
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ message: "删除失败 " + error, code: 400 });
    }
  }
}
