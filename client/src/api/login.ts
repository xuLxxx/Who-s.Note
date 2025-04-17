import server from "@/utils/request";
import type { UserInfo } from "./user/index.type";
import { FieldType } from "@/pages/Login";

/**
 * 登录
 * @param data: LoginForm
 * @returns res
 *
 */
export const login = (data: FieldType) => {
  return server.requestT<{ data: UserInfo }>({
    url: "/login",
    method: "post",
    data,
  });
};
