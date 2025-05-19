// features/reports/api/reportsEndPoints.ts
import { api } from "../../../app/api/api";
import {
  IReportParams,
  IAssetReportResponse,
  IUnit,
  ITaskReportResponse,
} from "../types/reportTypes";

export const reportsEndPoints = api.injectEndpoints({
  endpoints: (build) => ({
    getAssetReport: build.query<IAssetReportResponse, IReportParams>({
      query: (params) => ({
        url: "/report/asset-report",
        params,
      }),
      providesTags: () => ["Asset-Report"],
    }),
    getDisbursementsReport: build.query<IAssetReportResponse, IReportParams>({
      query: (params) => ({
        url: "/report/disbursements-report",
        params,
      }),
      providesTags: () => ["Asset-Report"],
    }),
    getTaskReport: build.query<ITaskReportResponse, IReportParams>({
      query: (params) => ({
        url: "/report/task-report",
        params,
      }),
      providesTags: () => ["Asset-Report"],
    }),

    getActiveUnits: build.query<IUnit[], void>({
      query: () => "/asset-unit/active-list",
      transformResponse: (response: { data: IUnit[] }) => response.data,
    }),
  }),
});

export const {
  useGetAssetReportQuery,
  useGetDisbursementsReportQuery,
  useGetActiveUnitsQuery,
  useGetTaskReportQuery,
} = reportsEndPoints;
