import * as jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../entity/User";
import { Request } from "express";

const SignKey = process.env.JWT_SECRET as string;

export const generateToken = (user: User) => {
  const token = jwt.sign(user, SignKey, { expiresIn: "1h" });
  return token;
};

export const verifyToken = (req: Request) => {
  try {
    const token: string = req.headers.authorization.split(" ")[1] as string;
    if (!token) throw new Error("token过期");
    const user = jwt.verify(token, SignKey) as User;
    return user;
  } catch (error) {
    throw new Error("token过期");
  }
};
