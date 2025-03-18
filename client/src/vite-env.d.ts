/// <reference types="vite/client" />

// 定义type保证安全
interface ImportMetaEnv {
  VITE_API_URL: string;
  VITE_APP_TITLE: string;
}

// 防止.env被修改
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 引用less时，style.header会报错类型“typeof import("*.less")”上不存在属性，所以需要声明
declare module "*.module.less" {
  const classes: { [key: string]: string };
  export default classes;
}
declare module "*.less";
