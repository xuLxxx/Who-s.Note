import { Router } from "express";
import { TalkController } from "../controller/talkController";

const talkRouter = Router();

talkRouter.get("/history", TalkController.getHistoryTalk);
talkRouter.post("/createRoom", TalkController.createRoom);
talkRouter.get("/getRoomList", TalkController.getRoomList);
talkRouter.get("/:roomId/getRoomByFullId", TalkController.getRoomByFullId);
talkRouter.get("/:roomId/getRoomMessage", TalkController.getRoomMessage);
talkRouter.post("/:roomId/joinRoom", TalkController.joinRoom);
talkRouter.post("/:roomId/sendMessage", TalkController.sendMessage);
talkRouter.get("/:roomId/getRoomUserList", TalkController.getRoomUserList);

export default talkRouter;
