import type { UserInfo } from "./index.type";
import server from "@/utils/request";

//获取用户信息
export const getUserInfo = () => {
  return server.requestT<{ data: { user: UserInfo } }>({
    url: "/user",
    method: "get",
  });
};
