// features/reports/api/reportsEndPoints.ts
import { api } from "../../../app/api/api";
import {
  IReportParams,
  IAssetReportResponse,
  IUnit,
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

    getActiveUnits: build.query<IUnit[], void>({
      query: () => "/asset-unit/active-list",
      transformResponse: (response: { data: IUnit[] }) => response.data,
    }),
  }),
});

export const { useGetAssetReportQuery, useGetActiveUnitsQuery } =
  reportsEndPoints;
