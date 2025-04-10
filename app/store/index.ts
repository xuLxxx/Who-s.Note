import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer } from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
// Or from '@reduxjs/toolkit/query/react'

import userReducer from "./slices/user.slice";
import markdownReducer from "./slices/markdown.slice";

import apiSlice from "@/services/api";

const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
};

const userPersistedReducer = persistReducer(persistConfig, userReducer);
const markdownPersistedReducer = persistReducer(persistConfig, markdownReducer);

export const store = configureStore({
  reducer: {
    user: userPersistedReducer,
    markdown: markdownPersistedReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
