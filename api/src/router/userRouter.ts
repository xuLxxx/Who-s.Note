import { Router } from "express";
import { UserController } from "../controller/userController";
import { MenuController } from "../controller/menuController";

// import expressWs from "express-ws";

const userRouter = Router();

// 用户登录注册API
userRouter.post("/login", UserController.login);
userRouter.post("/register", UserController.register);
userRouter.get("/user", UserController.getUserByToken);
userRouter.put("/user", UserController.updateUserInfo);

// 菜单路由
userRouter.get("/menu", MenuController.getMenu);
userRouter.post("/menu/add", MenuController.addMenu);

export default userRouter;
