import { init, Models, RematchDispatch, RematchRootState } from "@rematch/core";

import setting from "./model/setting";
import user from "./model/user";

export interface RootModel extends Models<RootModel> {
  setting: typeof setting;
  user: typeof user;
}

const model: RootModel = {
  setting,
  user,
};

const store = init({
  models: model,
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;

export default store;
