import type { WSResponse } from "websocket-express";
import { Request } from "express";

let wsList: any[] = [];

export class TalkController {
  static async getTalk(req: Request, res: WSResponse) {
    const ws = await res.accept();
    wsList.push(ws);
    try {
      ws.on("message", (msg) => {
        // if(msg)
        wsList.forEach((item) => {
          item.send(`echo ${msg}`); //接收信息
        });
      });
      ws.send(`Connect`); //发送信息
    } catch {
      console.log("socket", "error");
    }
  }
}
