import { Response } from "express";
import { Request } from "../express";
import { settingRepository } from "../repository";
import { fileRepository } from "../repository";
import * as jwt from "jsonwebtoken";
import * as multer from "multer";
import { Buffer } from "buffer";

import "dotenv/config";

const SignKey = process.env.JWT_SECRET as string;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./public");
  },
  filename(req, file, cb) {
    // file.originalname = Buffer.from(file.originalname, "Latin1").toString("utf-8"); //若出现中文乱码
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export class SettingController {
  static async upload(req: Request, res: Response) {
    try {
      const token: string = req.headers["authorization"].split(
        " "
      )[1] as string;
      const user: any = jwt.verify(token, SignKey);
      // console.log(user);
      upload.single("file")(req, res, async (err: any) => {
        if (err) {
          res.status(400).send({ message: "上传失败 " + err, code: 400 });
          return;
        } else {
          const result = await fileRepository.saveFile(user, req.file);
          res.status(200).send(result);
        }
      });
    } catch (error) {
      res.status(400).send({ message: "上传失败  " + error, code: 400 });
      return;
    }
  }
  static async getSetting(req: Request, res: Response) {
    const result = await settingRepository.getSetting();
    res.status(200).send(result);
  }
  
}
