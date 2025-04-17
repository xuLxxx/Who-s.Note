import type { UserInfo } from "./index.type";
import { hashObject } from "@/utils/object";
import server from "@/utils/request";
import store from "@/store";

//获取用户信息
export const getUserInfo = async () => {
  const config = {
    url: "/user",
    method: "get",
    headers: {
      lruCache: false,
    },
  };
  const key = hashObject(config);
  const result = await store.dispatch.user.getCache(key);
  if (result) {
    return result;
  }
  return server.requestT<{ data: { user: UserInfo } }>(config);
};
