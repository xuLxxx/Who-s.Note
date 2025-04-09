import * as api from "@/api/login";
import * as userApi from "@/api/user";
import { message } from "antd";
import { Dispatch, RootState } from "@/store";
import { UserInfo } from "@/store/model/index.type";
import { setToken, removeToken, getToken } from "@/utils/auth";
import { LRUCache } from "@/utils/LRUCache";

const userState: UserInfo = {
  username: "",
  id: null,
  role: "",
  token: getToken(),
  iat: 0,
  exp: 0,
};

const userCache = new LRUCache(5);

export default {
  state: userState,
  reducers: {
    setUserInfo: (state: UserInfo, payload: UserInfo) => {
      return { ...state, ...payload };
    },
    removeUserInfo: (state: UserInfo) => {
      return {
        ...state,
        username: "",
        id: null,
        role: "",
        token: removeToken(),
      };
    },
  },
  effects: (dispatch: Dispatch) => ({
    // 登录操作
    async login(params: { username: string; password: string }) {
      const res = await api.login(params);
      const { data } = res;
      if (res.code === 200) {
        message.success("登录成功");
        data.token && setToken(data.token);
        dispatch({
          type: "user/setUserInfo",
          payload: {
            username: data.username,
            id: data.id,
            role: data.role,
            token: data.token,
          },
        });
      }
      return res;
    },
    async logout() {
      // const res = await api.logout();
      // if (res.code === 200) {
      //   message.success("退出成功");
      //   removeToken();
      //   dispatch({
      //     type: "user/removeUserInfo",
      //   });
      // }
      // return res;
      try {
        dispatch({
          type: "user/removeUserInfo",
        });
        window.location.href = "/user/login";
        return true;
      } catch {
        return false;
      }
    },
    async getUserInfo() {
      const res = await userApi.getUserInfo();
      if (res.code === 200) {
        dispatch({
          type: "user/setUserInfo",
          payload: res.data.user,
        });
      }
      return res;
    },
    async getCache(key: any) {
      const result = await userCache.get(key);
      return result;
    },
    async setCache(payload: { key: any; data: any }) {
      userCache.set(payload.key, payload.data);
    },
  }),
};
