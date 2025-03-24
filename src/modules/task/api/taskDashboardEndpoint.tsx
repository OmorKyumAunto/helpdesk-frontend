import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import {
  IDashboardBarChartData,
  IDashboardCategoryWiseData,
  IDashboardDataCount,
  IDashboardTaskPercentage,
  IDashboardTodayTask,
} from "../types/taskTypes";

export const TaskDashboardEndPoint = api.injectEndpoints({
  endpoints: (build) => ({
    getDashboardTaskDataCount: build.query<
      HTTPResponse<IDashboardDataCount>,
      void
    >({
      query: () => {
        return {
          url: `/task-dashboard/count-data`,
        };
      },
      providesTags: () => ["Task"],
    }),
    getDashboardTaskPercentage: build.query<
      HTTPResponse<IDashboardTaskPercentage>,
      void
    >({
      query: () => {
        return {
          url: `/task-dashboard/task-percentage`,
        };
      },
      providesTags: () => ["Task"],
    }),
    getDashboardTodayTask: build.query<
      HTTPResponse<IDashboardTodayTask[]>,
      void
    >({
      query: () => {
        return {
          url: `/task-dashboard/today-task`,
        };
      },
      providesTags: () => ["Task"],
    }),
    getDashboardBarChartData: build.query<
      HTTPResponse<IDashboardBarChartData[]>,
      void
    >({
      query: () => {
        return {
          url: `/task-dashboard/task-dashboard-data`,
        };
      },
      providesTags: () => ["Task"],
    }),
    getDashboardCategoryWiseData: build.query<
      HTTPResponse<IDashboardCategoryWiseData[]>,
      void
    >({
      query: () => {
        return {
          url: `/task-dashboard/category-wise-ticket`,
        };
      },
      providesTags: () => ["Task"],
    }),
  }),
});

export const {
  useGetDashboardBarChartDataQuery,
  useGetDashboardCategoryWiseDataQuery,
  useGetDashboardTaskDataCountQuery,
  useGetDashboardTaskPercentageQuery,
  useGetDashboardTodayTaskQuery,
} = TaskDashboardEndPoint;
