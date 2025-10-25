import { Repository } from "typeorm";
import { Message, Room, User } from "../entity/index";

export class TalkService {
  constructor(
    private roomRepository: Repository<Room>,
    private messageRepository: Repository<Message>
  ) {}
  async createRoom(data: any, user: User) {
    try {
      const result = this.roomRepository.create({
        name: data.name,
        avatar: data.avatar || "",
        banner: data.banner || "",
        userList: [user],
      });
      await this.roomRepository.save(result);
      return { code: 200, message: "success", data: result };
    } catch (error) {
      return { code: 500, message: "创建房间失败", data: null };
    }
  }
  async joinRoom(roomId: string, user: User) {
    try {
      const result = await this.roomRepository.findOne({
        where: { id: roomId },
        relations: ["userList"],
      });
      if (result) {
        if (result.userList.find((item) => item.id === user.id)) {
          return { code: 400, message: "您已加入房间", data: null };
        }
        result.userList.push(user);
        await this.roomRepository.save(result);
        return {
          code: 200,
          message: "success",
          data: result,
        };
      } else {
        return { code: 400, message: "房间不存在", data: null };
      }
    } catch (error) {
      return { code: 500, message: "加入房间失败", data: null };
    }
  }
  async getRoomList(userId: number) {
    try {
      const result = await this.roomRepository.find({
        where: { userList: { id: userId } },
        relations: ["userList"],
      });
      return {
        code: 200,
        message: "success",
        data: result.map((item) => ({
          id: item.id,
          name: item.name,
          avatar: item.avatar,
          banner: item.banner,
        })),
      };
    } catch (error) {
      return { code: 500, message: "获取房间列表失败", data: null };
    }
  }
  async getRoomUserList(roomId: string) {
    try {
      const result = await this.roomRepository.findOne({
        where: { id: roomId },
        relations: ["userList"],
      });
      if (result) {
        return {
          code: 200,
          message: "success",
          data: result.userList.map((item) => ({
            id: item.id,
            username: item.username,
            role: item.role,
            avatar: item.avatar,
          })),
        };
      } else {
        return { code: 404, message: "房间不存在", data: null };
      }
    } catch (error) {
      return { code: 500, message: "获取房间用户列表失败", data: null };
    }
  }

  async sendMessage(roomId: string, user: User, data: any) {
    try {
      // 先查询 Room 对象
      const room = await this.roomRepository.findOne({
        where: { id: roomId },
        relations: ["messages", "userList"],
      });
      console.log(room);
      if (!room) {
        return { code: 404, message: "房间不存在", data: null };
      }
      if (!room.userList.find((item) => item.id === user.id)) {
        return { code: 403, message: "用户不在房间中", data: null };
      }

      // 使用实体对象创建消息
      const result = this.messageRepository.create({
        room,
        user,
        content: data.content,
      });
      room.messages.push(result);
      await this.roomRepository.save(room);
      await this.messageRepository.save(result);
      return { code: 200, message: "success" };
    } catch (error) {
      return { code: 500, message: error + "发送消息失败", data: null };
    }
  }
  async getRoomMessage(roomId: string) {
    try {
      const result = await this.roomRepository.findOne({
        where: { id: roomId },
        relations: ["messages", "userList"],
      });
      if (result) {
        const data = await Promise.all(
          result.messages.map(async (item) => {
            //   console.log(item);
            const msg = await this.messageRepository.findOne({
              where: { id: item.id },
              relations: ["user"],
            });
            return msg;
          })
        );
        return {
          code: 200,
          message: "success",
          data,
        };

        // return {
        //   code: 200,
        //   message: "success",
        //   data: result?.messages?.map((item) => ({
        //     id: item.id,
        //     content: item.content,
        //     user: {
        //       id: item.user.id,
        //       username: item.user.username,
        //       role: item.user.role,
        //       avatar: item.user.avatar,
        //     },
        //   })),
        // };
      } else {
        return { code: 404, message: "房间不存在", data: null };
      }
    } catch (error) {
      return { code: 500, message: "获取房间消息失败" + error, data: null };
    }
  }

  async getRoomByFullId(roomId: string) {
    try {
      const result = await this.roomRepository.findOne({
        where: { id: roomId },
      });
      if (result) {
        return {
          code: 200,
          message: "success",
          data: [result],
        };
      } else {
        return { code: 200, message: "房间不存在", data: [] };
      }
    } catch (error) {
      return { code: 500, message: "获取房间失败" + error, data: null };
    }
  }
}
