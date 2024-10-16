import { message } from "antd";
import { ILoginResponse, IUser } from "../../auth/types/loginTypes";
import { userApi } from "./userApi";
import { setRoleId, setToken } from "../features/userSlice";
import { baseQueryWithReAuth } from "../slice/baseQuery";
import asyncWrapper from "../../utils/asyncWrapper";
import { createApi } from "@reduxjs/toolkit/dist/query/react";

export const api = createApi({
  reducerPath: "Inventory_Api",
  baseQuery: baseQueryWithReAuth,
  // keepUnusedDataFor: expire.default,
  endpoints: (builder) => ({
    login: builder.mutation<
      ILoginResponse<IUser>,
      { id: string; password: string }
    >({
      query: (body) => ({
        url: "/authentication/login",
        method: "POST",
        body: body,
        credentials: "include",
      }),

      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        asyncWrapper(async () => {
          const { data } = await queryFulfilled;
          console.log(data?.data);
          dispatch(setToken(data?.data?.token!));
          dispatch(setRoleId(data.data?.role?.role_id!));
          await dispatch(userApi.endpoints.getMe.initiate());
          message.success("Successfully logged in!");
          localStorage.setItem("theme", "defaultTheme");
        });
      },
    }),
  }),
  tagTypes: [
    "User",
    "company-document",
    "restaurant-facilities",
    "representative",
    "Admin",
    "member",
    "payroll",
    "s-payroll",
    "employee",
    "accounts",
    "event",
    "s-event",
    "balance",
    "profile",
    "leave",
    "s-emp",
    "journal",
    "meeting",
    "resource",
    "notification",
    "accountHead",
    "money-receipt",
    "invoice",
    "clientLedger",
    "permission",
    "user",
    "advanceReturn",
    "expense-sub-head",
    "expense-head",
    "list",
    "accounts",
    "dashboardProfitLoss",
    "expense",
    "service",
    "asset",
    "dashboardTypes",
    "unit",
    "CTC",
    "license",
  ],
});

export const { useLoginMutation } = api;
