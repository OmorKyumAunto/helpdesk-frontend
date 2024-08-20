import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import notification from "../../../common/utils/Notification";
import asyncWrapper from "../../../utils/asyncWrapper";
import {
  IDashboardCalenderData,
  INotification,
  IViewDashboard,
} from "../types/dashboardTypes";

export const dashboardEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getAllDashboard: build.query<HTTPResponse<IViewDashboard>, void>({
      query: () => ({
        url: `/admin/dashboard`,
      }),
      // providesTags: () => [{ type: "dashboardTypes", id: "dashboard" }],
    }),
    getAllSchedule: build.query<HTTPResponse<IDashboardCalenderData[]>, any>({
      query: (params) => ({
        url: `/admin/dashboard/event/schedular/calender`,
        params,
      }),
      // providesTags: () => [{ type: "dashboardTypes", id: "dashboard" }],
    }),
    getNotifications: build.query<HTTPResponse<INotification[]>, void>({
      query: () => {
        return {
          url: `/admin/notification`,
        };
      },
      providesTags: () => ["notification"],
    }),

    readNotification: build.mutation<unknown, { id: number; data: any }>({
      query: ({ id, data }) => {
        return {
          url: `/admin/notification/${id}`,
          method: "PATCH",
          body: data,
        };
      },

      invalidatesTags: () => ["notification"],
    }),
    deleteNotification: build.mutation<unknown, void>({
      query: () => {
        return {
          url: `/admin/notification`,
          method: "DELETE",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully clear notifications");
        });
      },
      invalidatesTags: () => ["notification"],
    }),
  }),
});

export const {
  useGetAllDashboardQuery,
  useGetAllScheduleQuery,
  useGetNotificationsQuery,
  useDeleteNotificationMutation,
  useReadNotificationMutation,
} = dashboardEndpoints;
