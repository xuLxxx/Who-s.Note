import React from "react";
import ReactDOM from "react-dom/client";
// import { unstable_HistoryRouter as HistoryRouter } from "react-router";
import { BrowserRouter } from "react-router";
import { ConfigProvider, theme as antdTheme } from "antd";
import { Provider, useSelector } from "react-redux";
import Router from "./router";
import store, { RootState } from "./store";
// import history from "./browserHistory";
import App from "./app";
import zhCN from "antd/locale/zh_CN";  //Vite bug 504 (Outdated Optimize Dep) 解决 删掉node_modules 重新npm i 

import "normalize.css";

function ThemeSelector(): JSX.Element {
  const theme = useSelector((state: RootState) => state.setting.theme);
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm:
          theme === "dark"
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
        components: {
          Menu: {
            activeBarBorderWidth: 0,
            itemActiveBg: "#fff",
          },
        },
      }}>
      <Router />
      <App />
    </ConfigProvider>
  );
}

// 开发时禁用React.StrictMode，防止重复渲染BUG
ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeSelector />
      </BrowserRouter>
    </Provider>
  // </React.StrictMode>
);
