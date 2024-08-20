/* eslint-disable @typescript-eslint/no-explicit-any */

import { api } from "../app/api/api";
import notification from "../common/utils/Notification";
import asyncWrapper from "../utils/asyncWrapper";

export const forgetPassEndpoint = api.injectEndpoints({
  endpoints: (build) => ({
    getOTP: build.mutation<void, any>({
      query: (body) => ({
        url: `/common/send-email-otp`,
        method: "POST",
        body: body,
      }),
      onQueryStarted: (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully OTP Send");
        });
      },
    }),

    matchOtp: build.mutation<any, any>({
      query: (body) => ({
        url: `/common/match-email-otp`,
        method: "POST",
        body: body,
      }),
      onQueryStarted: (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully OTP Match");
        });
      },
    }),

    resetPassword: build.mutation<any, any>({
      query: (body) => ({
        url: `/auth/admin/forget-password`,
        method: "POST",
        body: body,
      }),
      onQueryStarted: (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully change password");
        });
      },
    }),

    changePassword: build.mutation<any, any>({
      query: (body) => ({
        url: `/admin/profile/change-password`,
        method: "POST",
        body: body,
      }),
      onQueryStarted: (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully update password");
        });
      },
    }),
  }),
});

export const {
  useGetOTPMutation,
  useMatchOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = forgetPassEndpoint;
