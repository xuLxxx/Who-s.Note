import server from "@/utils/request";
import type { UserInfo } from "./user/index.type";

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
