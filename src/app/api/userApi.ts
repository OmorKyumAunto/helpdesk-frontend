import { createApi } from "@reduxjs/toolkit/query/react";
import { ILoginResponse, IUser } from "../../auth/types/loginTypes";
import { setUser } from "../features/userSlice";
import { baseQueryWithReAuth } from "../slice/baseQuery";

export const userApi = createApi({
  baseQuery: baseQueryWithReAuth,
  reducerPath: "userApi",
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getMe: builder.query<ILoginResponse<IUser>, void>({
      query() {
        return {
          url: "/",
          // credentials: "include",
        };
      },

      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.data) {
            dispatch(setUser(data.data));
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useGetMeQuery } = userApi;
