import { Repository } from "typeorm";
import { Markdown } from "../entity/Markdown";
import { User } from "../entity/User";
import * as fs from "fs";

export class MdService {
  constructor(private MdRepository: Repository<Markdown>) {}
  async saveMarkdown(data: any, user: User) {
    // console.log(data, user);
    try {
      if (data.fileType !== "text/markdown")
        return {
          code: 400,
          message: "文件类型错误",
        };
      const file = new Markdown();
      file.userId = user.id;
      file.fileName = data.title || "";
      file.fileType = "text/markdown";
      file.fileUrl = data.fileUrl;
      file.pic = data.pic;
      file.title = data.title;
      // file.content = "";
      // console.log("../../uploads" + file.fileUrl.split("uploads")[1]);
      // http://localhost:3000/uploads/xxx.md -> ../../uploads/xxx.md
      // file.content = data.content;
      // const url = "../../uploads" + file.fileUrl.split("uploads")[1];
      // const content = fs.readFileSync(url, "utf-8");
      // console.log(content);
      // file.content = content || "";
      const item = this.MdRepository.create(file);
      console.log(item);
      await this.MdRepository.save(item);
      return {
        code: 200,
        message: "保存成功",
        data: file,
      };
    } catch {
      return {
        code: 500,
        message: "保存失败",
      };
    }
  }
  async getUserAllMarkdown(user: User) {
    try {
      const result = await this.MdRepository.find({
        where: {
          userId: user.id,
          fileType: "text/markdown",
        },
      });
      return {
        code: 200,
        message: "获取成功",
        data: result || [],
      };
    } catch {
      return {
        code: 500,
        message: "获取失败",
      };
    }
  }
  async getUserMarkdownByid(id: number, user: User) {
    try {
      const result = await this.MdRepository.findOne({
        where: {
          id,
          userId: user.id,
          fileType: "text/markdown",
        },
      });
      return {
        code: 200,
        message: "获取成功",
        data: result || {},
      };
    } catch {
      return {
        code: 500,
        message: "获取失败",
      };
    }
  }
  async deleteUserMarkdown(id: number, user: User) {
    try {
      await this.MdRepository.delete({
        id,
        userId: user.id,
      });
      return {
        code: 200,
        message: "删除成功",
      };
    } catch {
      return {
        code: 500,
        message: "删除失败",
      };
    }
  }
}
