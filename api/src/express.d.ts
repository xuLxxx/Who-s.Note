import { User } from "./entity/User";
import * as Express from "express";

export interface Request extends Express.Request {
  user: User;
}
