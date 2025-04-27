import { Router } from "express";
import { TodoController } from "../controller/todoController";

const todoRouter = Router();

todoRouter.get("/getEvents", TodoController.getEvents);
todoRouter.post("/addEvents", TodoController.addEvents);
todoRouter.delete("/:id/deleteEvents", TodoController.deleteEvents);
todoRouter.put("/:id/updateEvents", TodoController.updateEvents);
todoRouter.get("/getTodos", TodoController.getTodos);
todoRouter.post("/addTodos", TodoController.addTodos);
todoRouter.delete("/deleteTodos", TodoController.deleteTodos);
todoRouter.put("/updateTodos", TodoController.updateTodos);

todoRouter.get("/sorts", TodoController.getTodoSorts);
todoRouter.put("/sorts", TodoController.updateTodoSorts);

export default todoRouter;
