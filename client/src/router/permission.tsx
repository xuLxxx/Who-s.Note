import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dispatch, RootState } from "@/store";
import * as menuApi from "@/api/system/menu";
import { Navigate, useLocation } from "react-router";
// interface AuthProvider {
//   isAuthenticated: boolean;
//   username: string;
//   roles: string;
//   signin(): Promise<void>;
//   signout(): Promise<void>;
// }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispath = useDispatch<Dispatch>();
  const location = useLocation();
  // const isLogin = async () => {
  //   const res = await dispath.user.getUserInfo();
  //   console.log(res);
  // };
  // isLogin();
  useEffect(() => {
    dispath.setting.getMenu().then((res: { data: menuApi.Menu[] }) => {
      dispath.setting.saveMenu(res.data);
      dispath.user.getUserInfo();
    });
  }, [location.pathname]);

  return children;
}

export function AuthNoLogin({ children }: { children: React.ReactNode }) {
  const userInfo = useSelector((state: RootState) => state.user);
  if (userInfo.token) {
    return <Navigate to="/home" />;
  }
  return children;
}

// export const AuthProvider: AuthProvider = {
//   isAuthenticated: false,
//   username: "",
//   roles: "",
//   signin: async () => {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         AuthProvider.isAuthenticated = true;
//         AuthProvider.username = "admin";
//         AuthProvider.roles = "admin";
//         resolve();
//       }, 1000);
//     });
//   },
//   signout: async () => {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         AuthProvider.isAuthenticated = false;
//         AuthProvider.username = "";
//         AuthProvider.roles = "";
//         resolve();
//       }, 1000);
//     });
//   },
// };
