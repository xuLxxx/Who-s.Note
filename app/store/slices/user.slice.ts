import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "..";

const initialState: UserInfo = {
  token: "",
  username: "",
  role: "",
  id: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = "";
      state.username = "";
      state.role = "";
      state.id = null;
    },
    login: (state, action: PayloadAction<UserInfo>) => {
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.id = action.payload.id;
      state.token = action.payload.token;
    },
  },
});

export const { logout, login } = userSlice.actions;
export const getUser = (state: RootState) => state.user;
export const getToken = (state: RootState) => state.user.token;

export default userSlice.reducer;
