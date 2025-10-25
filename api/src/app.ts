import * as express from "express";
import { createServer } from "http";
import "dotenv/config";
import * as bodyParser from "body-parser";
import { AppDataSource } from "./data-source";
import { expressjwt } from "express-jwt";
import { Request, Response, NextFunction } from "express";
import * as cors from "cors";
import { initSocket } from "./utils/socket";

import userRouter from "./router/userRouter";
import todoRouter from "./router/todoRouter";
import fileRouter from "./router/fileRouter";
import mdRouter from "./router/mdRouter";
import settingRouter from "./router/settingRouter";
import talkRouter from "./router/talkRouter";

const app = express();
const SignKey = process.env.JWT_SECRET as string;
const server = createServer(app); // Add this
initSocket(server);

AppDataSource.initialize().then(async () => {
  //一个网络应用程序，需要绑定一个端口
  // const userRepository = connection.getRepository(User);

  app.use(bodyParser.json());
  app.use(cors());
  app.use("/", userRouter, fileRouter, mdRouter, settingRouter, talkRouter);
  // app.use("/ws", talkRouter);
  app.use("/todo", todoRouter);

  app.use(
    expressjwt({ secret: SignKey, algorithms: ["HS256"] }).unless({
      path: [
        "/login",
        "/register",
        "/setting/get",
        { url: /^\/uploads\/.*/ },
        { url: /^\/public\/.*/ },
        { url: /^\/socket.io\/.*/ },
      ],
    })
  );
  app.use("/uploads", express.static("./uploads"));
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // 官方 定义 err 类型为 any
    // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/6b3f9450aa2ced2bae7851acebc5ed9d7e6200c2/types/express-serve-static-core/index.d.ts#L45
    console.log(err);
    if (err.name === "UnauthorizedError") {
      console.error(req.path + ",无效token");
      // render the error page
      res.status(err.status || 500);
      res.render("error");
      res.send({
        message: "token过期，请重新登录",
        code: 401,
      });
      return;
    }
    next();
  });
  server.listen(process.env.PORT, () => {
    console.log("服务器启动成功", process.env.PORT);
  });
});
