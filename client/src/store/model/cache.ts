import { Dispatch, RootState } from "@/store";
import { UserInfo, ReduxCache } from "@/store/model/index.type";
import { LRUCache } from "@/utils/LRUCache";

const cacheState: ReduxCache = {
  userCache: new LRUCache(5),
};

export default {
  state: cacheState,
  reducers: {},
  effects: (dispatch: Dispatch) => ({}),
};
