import type { WSResponse } from "websocket-express";
import { Request } from "express";

export class TalkController {
  static async getTalk(req: Request, res: WSResponse) {
    const ws = await res.accept();
    ws.on("message", (msg) => {
      console.log(`echo ${msg}`); //接收信息
    });
    ws.send("hello");
    try {
      console.log("socket", req.headers["authorization"]);
    } catch {
      console.log("socket", "error");
    }
  }
}
