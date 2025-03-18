import React from "react";
import style from "./index.module.less";
import { useSelector } from "react-redux";
import { RootState } from "./store";

export default function App(): JSX.Element {
  const theme = useSelector((state: RootState) => state.setting.theme);
  const root = document.documentElement;
  root.className = theme;
  return (
    <>
      <div className={style.header}></div>
    </>
  );
}
