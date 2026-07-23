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
          url: "/profile/me",
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
      providesTags: ["User"],
    }),

    // Self-service email notification switch. The backend takes the user id
    // from the token, so there is nothing to pass but the new value.
    updateNotificationPreference: builder.mutation<
      { success: boolean; message: string; data: { email_notification: number } },
      boolean
    >({
      query: (enabled) => ({
        url: "/profile/notification-preference",
        method: "PUT",
        body: { email_notification: enabled },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetMeQuery, useUpdateNotificationPreferenceMutation } =
  userApi;
