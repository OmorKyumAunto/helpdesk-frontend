import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";

export const dashboardEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getAllDashboard: build.query<HTTPResponse<any>, void>({
      query: () => ({
        url: `/dashboard/dashboard-data`,
      }),
      providesTags: () => [{ type: "dashboardTypes", id: "dashboard" }],
    }),
    getDashboardPieData: build.query<HTTPResponse<any>, void>({
      query: () => ({
        url: `/dashboard/accessories-count`,
      }),
      providesTags: () => [{ type: "dashboardTypes", id: "dashboard" }],
    }),
    getDashboardBloodData: build.query<HTTPResponse<any>, void>({
      query: () => ({
        url: `/dashboard/blood-count`,
      }),
      providesTags: () => [{ type: "dashboardTypes", id: "dashboard" }],
    }),
    getDashboardGraphData: build.query<HTTPResponse<any>, any>({
      query: (params) => ({
        url: `/dashboard/dashboard-graph-data`,
        params,
      }),
      providesTags: () => [{ type: "dashboardTypes", id: "dashboard" }],
    }),
    getDashboardAssetDataForAdmin: build.query<HTTPResponse<any>, any>({
      query: () => ({
        url: `/dashboard/admin-unit-wise-asset-count`,
      }),
      providesTags: () => [{ type: "dashboardTypes", id: "dashboard" }],
    }),
    getDashboardEmployeeData: build.query<HTTPResponse<any>, any>({
      query: (params) => ({
        url: `/dashboard/dashboard-graph-data`,
        params,
      }),
      providesTags: () => [{ type: "dashboardTypes", id: "dashboard" }],
    }),
  }),
});

export const {
  useGetAllDashboardQuery,
  useGetDashboardGraphDataQuery,
  useGetDashboardBloodDataQuery,
  useGetDashboardPieDataQuery,
  useGetDashboardEmployeeDataQuery,
  useGetDashboardAssetDataForAdminQuery,
} = dashboardEndpoints;
