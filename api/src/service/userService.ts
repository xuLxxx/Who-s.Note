import { Code, Repository } from "typeorm";
import { User } from "../entity/User";
import * as jwt from "jsonwebtoken";
import "dotenv/config";
import { verifyToken, verifyTokenByReq } from "../utils/auth";

const SignKey = process.env.JWT_SECRET as string;

export class UserService {
  constructor(private readonly userRepository: Repository<User>) {}
  async registerUser(newuser: User) {
    const { username } = newuser;
    const haveThis = await this.userRepository.findOne({ where: { username } });
    if (haveThis) {
      return { code: 201, message: "用户名已存在" };
    }
    const user = this.userRepository.create(newuser);
    await this.userRepository.save(user);
    // console.log(user);
    const token = jwt.sign({ user }, SignKey, { expiresIn: "48h" });
    return {
      message: "注册成功",
      code: 200,
      data: {
        id: user.id,
        username,
        role: user.role,
        token,
      },
    };
  }
  async loginUser(user: User) {
    const { username, password } = user;
    const thisOne = await this.userRepository.findOne({ where: { username } });
    if (!thisOne || thisOne.password !== password) {
      return { code: 201, message: "用户名或密码错误" };
    } else if (password === thisOne.password) {
      const token = jwt.sign(
        { id: thisOne.id, username: thisOne.username, role: thisOne.role },
        SignKey,
        { expiresIn: "48h" }
      );
      return {
        message: "登录成功",
        code: 200,
        data: {
          id: thisOne.id,
          username,
          role: thisOne.role,
          token,
        },
      };
    } else {
      return { code: 201, message: "未知错误" };
    }
  }
  async getUserByToken(token: string) {
    try {
      const { id } = verifyToken(token);
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        return { code: 201, message: "用户不存在" };
      }

      return {
        code: 200,
        message: "获取用户信息成功",
        data: {
          user: {
            ...user,
            password: undefined,
          },
        },
      };
    } catch (error) {
      return { code: 401, message: "token 过期" };
    } finally {
      console.log("Get User");
    }
  }
  async updateUserInfo(user: User) {
    const { username, avatar } = user;
    const thisOne = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!thisOne) {
      return { code: 201, message: "用户不存在" };
    }
    thisOne.avatar = avatar;
    thisOne.username = username;
    await this.userRepository.save(thisOne);
    return {
      message: "更新成功",
      code: 200,
      data: {
        username,
        avatar,
      },
    };
  }
}
