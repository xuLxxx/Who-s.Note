import React, { useEffect } from "react";
import * as userApi from "@/api/user";
import * as menuApi from "@/api/system/menu";
import { Routes, Route, Navigate, useLocation } from "react-router";
import Loading from "@/components/Loading";
import BasicLayout from "@/layout/BasicLayout";
import { AuthProvider, AuthNoLogin } from "./permission";
// import HomeContainer from "../pages/Home";
// import Friend from "../pages/Friend";
import loadable from "@loadable/component"; //无法找到类型文件解决方法 npm i --save-dev @types/loadable__component
import { Layout } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "@/store";

const vhStyle: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
};

const fillStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
};

//异步加载各个路由模块
const [Login] = [() => import("../pages/Login")].map((item) => {
  return loadable(item as any, {
    fallback: <Loading style={vhStyle} />,
  });
});

const [Home, Friend, Personal] = [
  () => import("../pages/Home"),
  () => import("../pages/Friend"),
  () => import("../pages/Personal"),
].map((item) => {
  return loadable(item as any, {
    fallback: <Loading style={fillStyle} />,
  });
});

function Router(): JSX.Element {
  const dispath = useDispatch<Dispatch>();
  const location = useLocation();
  // useEffect(() => {
    
  // }, [location.pathname]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthProvider>
            <BasicLayout />
          </AuthProvider>
        }>
        <Route path="/" element={<Navigate to="home" />}></Route>
        <Route path="home" element={<Home />} />
        <Route path="friend" element={<Friend />} />
        <Route path="setting/personal" element={<Personal />}></Route>
      </Route>
      <Route
        path="/user"
        element={
          <AuthNoLogin>
            <Login />
          </AuthNoLogin>
        }>
        <Route path="/user" element={<Navigate to="login" />}></Route>
        <Route path="login" element={<Login />} />
        <Route path="*" element={<Navigate to="login" />} />
      </Route>
    </Routes>
  );
}

export default Router;

// const router = createBrowserRouter([
//   {
//     id: "root",
//     path: "/",
//     loader: (): any => {
//       return redirect("/login");
//     },
//     children: [
//       {
//         id: "login",
//         path: "/login",
//         Component: Login,
//       },
//       {
//         id: "home",
//         path: "/home",
//         Component: Home,
//       },
//     ],
//   },
//   {
//     path: "/logout",
//     async action(): Promise<ActionFunction> {
//       await AuthProvider.signout();
//       return redirect("/") as any;
//     },
//   },
// ]);

// export default function Router(): JSX.Element {
//   return <RouterProvider router={router} />;
// }

// const isLogin: boolean = useMemo((): boolean => {
//   userApi.getUserInfo().then((res) => {
//     if (res.code === 200) {
//       return true;
//     } else {
//       return false;
//     }
//   });
//   return false;
// }, [location.pathname]);
// if (isLogin) {
//   return redirect("/home");
// } else {
//   return redirect("/login");
// }

// function rootLoader() {}
