import { Router } from "express";
import { SettingController } from "../controller/settingController";

const settingRouter = Router();

settingRouter.post("/setting/upload", SettingController.upload);
settingRouter.get("/setting/get", SettingController.getSetting);

export default settingRouter;
