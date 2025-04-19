import { init, Models, RematchDispatch, RematchRootState } from "@rematch/core";

import setting from "./model/setting";
import user from "./model/user";
import todo from "./model/todo";

export interface RootModel extends Models<RootModel> {
  setting: typeof setting;
  todo: typeof todo;
  user: typeof user;
}

const model: RootModel = {
  setting,
  user,
  todo,
};

const store = init({
  models: model,
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;

export default store;
