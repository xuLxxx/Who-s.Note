import { Response, Request } from "express";
import "dotenv/config";
import { verifyTokenByReq } from "../utils/auth";
import { talkRepository } from "../repository";
import { User } from "../entity";

export class TalkController {
  static async getHistoryTalk(req: Request, res: Response) {
    // const result = await settingRepository.getSetting();
    // res.status(200).send(result);
  }

  static async createRoom(req: Request, res: Response) {
    try {
      const data = req.body;
      const token = verifyTokenByReq(req);
      if (!token.id) {
        res.status(200).send({ message: "未登录", code: 401 });
        return;
      } else {
        console.log(data, token, req.body);
        const user = {
          id: token.id,
          username: token.username,
          avatar: token.avatar,
          role: token.role,
        } as User;
        const result = await talkRepository.createRoom(data, user);
        res.status(200).send(result);
      }
    } catch (error) {
      res.status(200).send({ message: "创建房间失败", code: 500 });
    }
  }

  static async getRoomList(req: Request, res: Response) {
    try {
      const { id } = verifyTokenByReq(req);
      if (!id) {
        res.status(200).send({ message: "未登录", code: 401 });
        return;
      }
      const result = await talkRepository.getRoomList(id);
      res.status(200).send(result);
    } catch (error) {
      res.status(200).send({ message: "获取房间列表失败", code: 500 });
    }
  }

  static async getRoomUserList(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const token = verifyTokenByReq(req);
      if (!token.id) {
        res.status(200).send({ message: "未登录", code: 401 });
        return;
      } else {
        const result = await talkRepository.getRoomUserList(roomId);
        res.status(200).send(result);
      }
    } catch (error) {
      res.status(200).send({ message: "获取房间用户列表失败", code: 500 });
    }
  }

  static async joinRoom(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const token = verifyTokenByReq(req);
      if (!token.id) {
        res.status(200).send({ message: "未登录", code: 401 });
        return;
      } else {
        const user = {
          id: token.id,
          username: token.username,
          avatar: token.avatar,
          role: token.role,
        } as User;
        const result = await talkRepository.joinRoom(roomId, user);
        res.status(200).send(result);
      }
    } catch (error) {
      res.status(200).send({ message: "加入房间失败", code: 500 });
    }
  }

  static async sendMessage(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const token = verifyTokenByReq(req);
      if (!token.id) {
        res.status(200).send({ message: "未登录", code: 401 });
        return;
      } else {
        const user = {
          id: token.id,
          username: token.username,
          avatar: token.avatar,
          role: token.role,
        } as User;
        console.log(roomId, user, req.body);
        const result = await talkRepository.sendMessage(roomId, user, req.body);
        res.status(200).send(result);
      }
    } catch (error) {
      res.status(200).send({ message: "发送消息失败", code: 500 });
    }
  }

  static async getRoomMessage(req: Request, res: Response) {
    // const result = await settingRepository.getSetting();
    // res.status(200).send(result);
    try {
      const { roomId } = req.params;
      const token = verifyTokenByReq(req);
      if (!token.id) {
        res.status(200).send({ message: "未登录", code: 401 });
        return;
      } else {
        const result = await talkRepository.getRoomMessage(roomId);
        res.status(200).send(result);
      }
    } catch (error) {
      res.status(200).send({ message: "获取房间消息失败", code: 500 });
    }
  }

  static async getRoomByFullId(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const token = verifyTokenByReq(req);
      if (!token.id) {
        res.status(200).send({ message: "未登录", code: 401 });
        return;
      } else {
        const result = await talkRepository.getRoomByFullId(roomId);
        res.status(200).send(result);
      }
    } catch (error) {
      res.status(200).send({ message: "获取房间失败", code: 500 });
    }
  }

  // static async leaveRoom(req: Request, res: Response) {
  //   try {
  //     const { roomId } = req.params;
  //     const token = verifyTokenByReq(req);
  //     if (!token.id) {
  //       res.status(200).send({ message: "未登录", code: 401 });
  //       return;
  //     } else {
  //       const user = {
  //         id: token.id,
  //         username: token.username,
  //         avatar: token.avatar,
  //         role: token.role,
  //       } as User;
  //       const result = await talkRepository.leaveRoom(roomId, user);
  //       res.status(200).send(result);
  //     }
  //   } catch (error) {
  //     res.status(200).send({ message: "退出房间失败", code: 500 });
  //   }
  // }
}
