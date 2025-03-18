import { Router } from "websocket-express";
import { TalkController } from "../controller/talkController";

const talkRouter = new Router();

talkRouter.ws("/test", TalkController.getTalk);

export default talkRouter;
