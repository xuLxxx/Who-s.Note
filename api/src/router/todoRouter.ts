import { Router } from "express";
import { TodoController } from "../controller/todoController";

const todoRouter = Router();

todoRouter.get("/getEvents", TodoController.getEvents);
// todoRouter.get("/getTodos", TodoController.getTodos);
todoRouter.put("/updateEvents", TodoController.updateEvents);
// todoRouter.put("/updateTodos", TodoController.updateTodos);

export default todoRouter;
