import React, { useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dispatch } from "@/store";

// interface AuthProvider {
//   isAuthenticated: boolean;
//   username: string;
//   roles: string;
//   signin(): Promise<void>;
//   signout(): Promise<void>;
// }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispath = useDispatch<Dispatch>();
  const isLogin = async () => {
    const res = await dispath.user.getUserInfo();
    console.log(res);
  };
  isLogin();
  return children;
}

export function AuthNoLogin({ children }: { children: React.ReactNode }) {
  // const dispath = useDispatch<Dispatch>();
  // const userInfo = useSelector((state: any) => state.user.userInfo);
  // console.log(userInfo);
  // useEffect(() => {
  //   if (!userInfo) {
  //     dispath.user.getUserInfo().then((res: any) => {
  //       console.log(res);
  //     });
  //   }
  // }, []);
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
