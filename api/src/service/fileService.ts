import { Repository } from "typeorm";
import { File } from "../entity/File";
import { User } from "../entity/User";

export class FileService {
  constructor(private fileRepository: Repository<File>) {}
  async saveFile(user: User, data: any) {
    // console.log(data);
    try {
      const file = new File();
      file.userId = user.id;
      file.fileName = data.originalname;
      file.fileType = data.mimetype;
      file.fileUrl = `http://localhost:3000/uploads/${data.filename}`;
      const item = this.fileRepository.create(file);
      await this.fileRepository.save(item);
      return {
        code: 200,
        message: "上传成功",
        data: file,
      };
    } catch {
      return {
        code: 500,
        message: "上传失败",
      };
    }
  }
}
