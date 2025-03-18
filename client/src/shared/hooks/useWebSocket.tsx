import React from "react";
import { baseUrl } from "@/shared";

export const useWebSocket = (url: string) => {
  const [data, setData] = React.useState<any>(null);
  const [ws, setWs] = React.useState<WebSocket | null>(null);

  React.useEffect(() => {
    if (!url) return;
    const newWs = new WebSocket(baseUrl + url);
    newWs.onopen = () => {
      console.log("连接成功");
    };
    newWs.onmessage = (event: MessageEvent) => {
      console.log("收到消息", event);
      setData(JSON.parse(event.data));
    };
    newWs.onclose = () => {
      console.log("连接关闭");
    };
    setWs(newWs);
    return () => {
      newWs.close();
    };
  }, [url]);

  const onSend = (data: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  };

  return { data, onSend };
};

// import React from "react";

// const timeout = 1000 * 20;

// interface WebSocketAppStateType {
//   isLoad: boolean;
//   msg: MessageEvent | null;
// }

// interface WebSocketAppEventType extends WebSocketAppStateType {
//   initWebSocket: (url: string) => void; //初始化
//   onClose: () => void; //关闭
//   onSend: (msg: string) => void; //发送信息
// }

// const WebSocketStateContext = React.createContext<
//   WebSocketAppEventType | undefined
// >(undefined);

// export const WebSocketStateProvider: React.FC<{
//   children: React.ReactNode;
// }> = ({ children }) => {
//   const [myWs, setMyWs] = React.useState<WebSocket | null>(null);
//   //心跳timeout
//   const timeoutObj = React.useRef<any>(null);
//   //延迟重连timeout
//   const delayObj = React.useRef<any>(null);
//   //判断是否需要重连
//   const reConnect = React.useRef<boolean>(false);
//   //   使用上面定义WebSocketAppEventType类型;
//   const [state, setState] = React.useState<WebSocketAppStateType>({
//     isLoad: false,
//     msg: null,
//   });

//   const initWebSocket = (url?: string) => {
//     const newState = { ...state, isLoad: false };

//     setState(newState);
//     const newWs = new WebSocket(`${baseUrl}${url}`);
//     newWs.onclose = wsClose;
//     newWs.onmessage = wsMessage;
//     newWs.onopen = () => {
//       console.log("连接成功");
//       const newState = { ...state, isLoad: true };
//       setState(newState);
//       // startWsHeartBeat();
//     };
//   };

//   const wsClose = (e: CloseEvent) => {
//     //websocket报错封装
//     console.log("连接关闭");
//     const { code } = e;
//     if (code === 1000) {
//       console.log(code, ":正常关闭");
//     } else if (code === 1001) {
//       console.log(code, ":终端离开");
//     } else if (e.code === 1002) {
//       console.log(code, ":协议错误中断连接");
//     } else if (e.code === 1009) {
//       console.log(code, ":收到过大的数据帧断开连接");
//     } else if (e.code === 1012) {
//       console.log(code, ":服务器重启断开连接");
//     } else {
//       console.error("Ws Close", e);
//     }
//     const newState = { ...state, isLoad: false };
//     setState(newState);
//   };
//   // 断开连接
//   const onClose = () => {
//     myWs?.close();
//   };
//   // 接收消息
//   const wsMessage = (msg: MessageEvent) => {
//     // 接收消息后重置心跳
//     // resetHeartbeat();
//     const newState = { ...state, msg };
//     setState(newState);
//   };
//   // 重置心跳
//   const resetHeartbeat = () => {
//     clearTimeout(timeoutObj.current);
//     clearTimeout(delayObj.current);
//     // startWsHeartBeat();
//   };
//   // 发送消息
//   const onSend = async (msg: any) => {
//     myWs?.send(msg);
//   };
//   const startWsHeartBeat = () => {
//     timeoutObj.current && clearTimeout(timeoutObj.current);
//     // 心跳ping
//     timeoutObj.current = setInterval(() => {
//       // 发送ping （这边也可以不发送，只是定时检查一下websocket是否链接正常，后端有需要才发送ping，不然发了也没啥用）
//       onSend(JSON.stringify({ msg: "ping" }));
//       const newState = { ...state, isLoad: true };
//       setState(newState);
//       if (wsStatus() !== 1) {
//         // 重连
//         onReconnect();
//       }
//     }, timeout);
//   };
//   // 获取websocket连接状态
//   const wsStatus = () => {
//     return myWs?.readyState;
//   };
//   // 重新连接
//   const onReconnect = () => {
//     if (reConnect.current) {
//       return null;
//     }
//     reConnect.current = true;
//     delayObj.current && clearTimeout(delayObj.current);
//     // 延迟重连
//     delayObj.current = setTimeout(() => {
//       initWebSocket();
//       reConnect.current = false;
//     }, 3000);
//   };

//   const value: WebSocketAppEventType = {
//     ...state,
//     initWebSocket,
//     onClose,
//     onSend,
//   };
//   return (
//     <WebSocketStateContext.Provider value={value}>
//       {children}
//     </WebSocketStateContext.Provider>
//   );
// };

// export const useWebSocketState = (): WebSocketAppEventType => {
//   const state = React.useContext(WebSocketStateContext);

//   if (!state) {
//     throw new Error(
//       "useWebSocketState must be used within an WebSocketStateProvider"
//     );
//   }

//   return state;
// };
