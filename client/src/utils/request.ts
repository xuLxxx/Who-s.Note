import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { message, Modal } from "antd";
import { tansParams } from "./tansParams";
import { removeToken } from "./auth";
import { getToken } from "./auth";
import history from "@/browserHistory";

// 是否显示重新登录
export const isRelogin = { show: false };

message.config({
  duration: 2, //全局定义消息提示框的显示时间
  maxCount: 3, //页面上最多显示几个
});

type ResponseData<T = unknown> = {
  message?: string;
  code?: number;
  data?: T;
};

type RequsetObj = {
  url: string;
  data: string;
  time: number;
};

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";

export class Service {
  private instance: AxiosInstance; // 保存当前实例
  private baseConfig: AxiosRequestConfig = {
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
  };
  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(Object.assign(this.baseConfig, config));
    this.instance.interceptors.request.use(
      (config: any) => {
        // 是否需要设置 token
        // config.headers.Cookie = "";
        const isToken = (config.headers || {}).isToken === false;
        if (getToken() || !isToken) {
          config.headers["Authorization"] = "Bearer " + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        if (config.method === "get" && config.params) {
          let url = config.url + "?" + tansParams(config.params);
          url = url.slice(0, -1);
          config.params = {};
          config.url = url;
        }
        if (config.method === "post" || config.method === "put") {
          const requestObj: RequsetObj = {
            url: config.url,
            data:
              typeof config.data === "object"
                ? JSON.stringify(config.data)
                : config.data,
            time: new Date().getTime(),
          };
          const sessionObj = JSON.parse(
            sessionStorage.getItem("sessionObj") as string
          );
          // console.log("sessionObj", sessionObj);
          if (!sessionObj) {
            sessionStorage.setItem("sessionObj", JSON.stringify(requestObj));
          } else {
            const s_url = sessionObj.url; // 请求地址
            const s_data = sessionObj.data; // 请求数据
            const s_time = sessionObj.time; // 请求时间
            const interval = 800; // 间隔时间(ms)，小于此时间视为重复提交
            sessionStorage.setItem("sessionObj", JSON.stringify(requestObj));
            if (
              (!(s_data && requestObj.data) || s_data === requestObj.data) &&
              s_url === requestObj.url &&
              new Date().getTime() - s_time < interval
            ) {
              return Promise.reject(new Error("请勿频繁提交！"));
            }
          }
        }
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );
    this.instance.interceptors.response.use((res: any) => {
      //如果响应成功(2xx内响应码)
      // console.log(res);
      const code = res.data.code || res.code || 200;
      // 获取错误信息
      const msg = res.data.message || "Error";
      // 二进制数据则直接返回
      if (
        res.request.responseType === "blob" ||
        res.request.responseType === "arraybuffer"
      ) {
        return res.data;
      }
      if (code === 401) {
        // 未登录
        removeToken();
        if (!isRelogin.show) {
          isRelogin.show = true;
          Modal.confirm({
            content: "登录状态已过期，您可以继续留在该页面，或者重新登录",
            okText: "重新登录",
            cancelText: "取消",
            type: "warning",
            onOk: () => {
              window.location.href = "/user/login";
              history.push("/user/login");
              isRelogin.show = false;
            },
            onCancel: () => {
              isRelogin.show = false;
            },
          });
        }
        return Promise.reject("无效的会话，或者会话已过期，请重新登录。");
      } else if (code === 500) {
        message.error({ content: msg, type: "error" });
        return Promise.reject(new Error(msg));
      } else if (code === 601) {
        message.warning({ content: msg, type: "warning" });
        return Promise.reject(new Error(msg));
      } else if (code !== 200) {
        console.log("error", res);
        message.error({ content: msg });
        return Promise.reject("error");
      } else {
        return Promise.resolve(res.data);
      }
    });
  }
  /**
   * 请求方法 此接口的后台参数不标准
   * 需要后台处理
   * @param config
   * @returns Promise
   */
  public requestT<T = unknown>(
    config: AxiosRequestConfig
  ): Promise<ResponseData & T> {
    return this.instance.request(config);
  }

  /**
   * 请求方法
   * @param config
   * @returns Promise
   */
  public request<T = unknown>(
    config: AxiosRequestConfig
  ): Promise<ResponseData<T>> {
    return this.instance.request(config);
  }

  /**
   * get请求
   * @param url
   * @param config
   * @returns
   */
  public get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ResponseData<T>> {
    return this.instance.get(url, config);
  }

  /**
   * post 请求
   * @param url
   * @param data
   * @param config
   * @returns
   */
  public post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ResponseData<T>> {
    return this.instance.post(url, data, config);
  }

  /**
   * put 请求
   * @param url
   * @param data
   * @param config
   * @returns
   */
  public put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ResponseData<T>> {
    return this.instance.put(url, data, config);
  }

  /**
   * delete 请求
   * @param url
   * @param data
   * @param config
   * @returns
   */
  public delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ResponseData<T>> {
    return this.instance.delete(url, config);
  }
}

export default new Service({});
