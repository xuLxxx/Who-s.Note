import { Setting } from "@/store/model/index.type";

export function getSetting() {
  const r: Setting = JSON.parse(localStorage.getItem("setting") as string);
  return r;
}

export function setSetting(setting: Setting) {
  localStorage.setItem("setting", JSON.stringify(setting));
}
