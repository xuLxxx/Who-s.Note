import { Router } from "express";
import { FileController } from "../controller/fileController";

const fileRouter = Router();

fileRouter.post("/upload", FileController.upload);

export default fileRouter;
