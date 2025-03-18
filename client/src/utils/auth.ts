import Cookie from "js-cookie";

export const TOKEN_KEY: string = "token";

export const getToken = () => {
  return Cookie.get(TOKEN_KEY) as string;
};

export const setToken = (token: string) => {
  Cookie.set(TOKEN_KEY, token);
};

export const removeToken = () => {
  Cookie.remove(TOKEN_KEY);
  return "";
};
