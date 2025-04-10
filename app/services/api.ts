import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_BASE_URL,
    prepareHeaders: (headers, { getState }: any) => {
      const token = getState().user.token;
      if (token) headers.set("Authorization", token);
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({}),
});

export default apiSlice;
