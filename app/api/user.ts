import type { UserInfo } from "./index.type";
import { hashObject } from "@/utils/object";
import server from "@/utils/request";

export type LoginForm = {
  username: string;
  password: string;
  remember?: boolean;
};

/**
 * 登录
 * @param data: LoginForm
 * @returns res
 *
 */
export const login = (data: LoginForm) => {
  return server.requestT<{ data: UserInfo }>({
    url: "/login",
    method: "post",
    data,
  });
};

//获取用户信息
export const getUserInfo = async () => {
  const config = {
    url: "/user",
    method: "get",
    headers: {
      lruCache: true,
    },
  };
//   const key = hashObject(config);
//   const result = await store.dispatch.user.getCache(key);
//   if (result) {
//     return result;
//   }
  return server.requestT<{ data: { user: UserInfo } }>(config);
};
