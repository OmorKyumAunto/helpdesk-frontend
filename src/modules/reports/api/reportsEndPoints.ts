// features/reports/api/reportsEndPoints.ts
import { api } from "../../../app/api/api";
import { IAssetReport, IAssetReportParams, IAssetReportResponse, IUnit } from "../types/reportTypes";

export const reportsEndPoints = api.injectEndpoints({
  endpoints: (build) => ({
    // Get Asset Report with Filters
    getAssetReport: build.query<IAssetReportResponse, IAssetReportParams>({
      query: (params) => ({
        url: "/report/asset-report",
        params,
      }),
      providesTags: () => ["Asset-Report"],
    }),

    // ✅ Get Active Unit List
    getActiveUnits: build.query<IUnit[], void>({
      query: () => "/asset-unit/active-list",
      transformResponse: (response: { data: IUnit[] }) => response.data,
    }),
  }),
});

export const { useGetAssetReportQuery, useGetActiveUnitsQuery } = reportsEndPoints;
