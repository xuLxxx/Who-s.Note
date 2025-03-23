import { Router } from "express";
import { MdController } from "../controller/mdController";

const fileRouter = Router();

fileRouter.post("/markdown", MdController.saveMarkdown);
fileRouter.get("/markdown", MdController.getUserAllMarkdown);
fileRouter.get("/markdown/:id", MdController.getUserMarkdownByid);
fileRouter.delete("/markdown", MdController.deleteUserMarkdown);

export default fileRouter;
