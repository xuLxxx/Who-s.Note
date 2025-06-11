import * as menuApi from "@/api/system/menu";
import { Setting } from "./index.type";
import { Dispatch } from "@/store";

import { getSetting, setSetting } from "@/utils/tools";

const settingState: Setting = {
  menu: [],
  collapse: getSetting() ? getSetting().collapse : true,
  theme: getSetting() ? getSetting().theme : "dark",
  lazyImg: false,
};

const dataToJson = (one: number, data: menuApi.Menu[]) => {
  let child: menuApi.Menu[] = [];
  if (!one) {
    child = data.filter((item) => !item.parentId);
  } else {
    child = data.filter((item) => item.parentId === one);
  }
  child.forEach((item) => {
    item.children = dataToJson(item.id, data);
  });
  return child.length ? child : void 0;
};

export default {
  state: settingState,
  reducers: {
    setSetting: (state: Setting, payload: Setting) => {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch: Dispatch) => ({
    async getMenu() {
      const res = await menuApi.getMenu();
      return res;
    },
    async saveMenu(data: menuApi.Menu[]) {
      data = data.filter((item) => item.conditions === 1);
      data.sort((a, b) => a.sorts - b.sorts);
      const sourceData = dataToJson(0, data) as menuApi.Menu[];
      dispatch({
        type: "setting/setSetting",
        payload: {
          menu: sourceData,
        },
      });
    },
    async changeTheme(theme: "dark" | "light") {
      dispatch({
        type: "setting/setSetting",
        payload: {
          theme,
        },
      });
      setSetting({
        menu: [],
        theme,
        collapse: getSetting() ? getSetting().collapse : true,
        lazyImg: false,
      });
    },
    async changeCollapse(collapse: boolean) {
      dispatch({
        type: "setting/setSetting",
        payload: {
          collapse,
        },
      });
      setSetting({
        menu: [],
        theme: getSetting() ? getSetting().theme : "dark",
        collapse: collapse,
        lazyImg: false,
      });
    },
    async changeLazyImg(lazyImg: boolean) {
      dispatch({
        type: "setting/setSetting",
        payload: {
          lazyImg,
        },
      });
      setSetting({
        menu: [],
        theme: getSetting() ? getSetting().theme : "dark",
        collapse: getSetting() ? getSetting().collapse : true,
        lazyImg: lazyImg,
      });
    },
  }),
};
