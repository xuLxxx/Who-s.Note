import apiSlice from "./api";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ body }) => ({
        url: "/user/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    getUserInfo: builder.query({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    register: builder.mutation({
      query: ({ body }) => ({
        url: "/user/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useLoginMutation, useGetUserInfoQuery, useRegisterMutation } =
  userApiSlice;
