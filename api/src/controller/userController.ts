import { Request, Response } from "express";
import { userRepository } from "../repository";
import { User } from "../entity/User";
import * as jwt from "jsonwebtoken";
import md5 from "../utils/crypto";

export class UserController {
  static async register(req: Request, res: Response) {
    const { username, password } = req.body;
    const data = new User();
    if (!username || !password) {
      res.status(200).send({ message: "用户名或密码不能为空", code: 400 });
    } else if (password.length > 16 || password.length < 4) {
      //   console.log(password);
      res
        .status(200)
        .send({ message: "密码长度不能小于4位或大于16位", code: 400 });
    }
    data.username = req.body.username;
    data.password = md5(req.body.password);
    data.role = "user";
    const result = await userRepository.registerUser(data);
    res.status(200).send(result);
  }
  static async login(req: Request, res: Response) {
    const data = new User();
    data.username = req.body.username;
    data.password = md5(req.body.password);
    const result = await userRepository.loginUser(data);
    if (result.code === 200) {
      res.cookie("token", result.data.token, {
        maxAge: 1000 * 60 * 60,
        httpOnly: false,
      });
      res.status(200).send(result);
    } else {
      res.status(201).send(result);
    }
  }
  static async getUserByToken(req: Request, res: Response) {
    if (!req.headers["authorization"]) {
      res.status(201).send({ message: "未登录！", code: 400 });
      return;
    }
    const token: string = req.headers["authorization"].split(" ")[1] as string;
    if (!token) {
      return;
    }
    const result = await userRepository.getUserByToken(token);
    res.status(200).send(result);
  }

}
