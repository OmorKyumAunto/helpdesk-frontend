import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import notification from "../../../common/utils/Notification";
import asyncWrapper from "../../../utils/asyncWrapper";
import { ILogHistory, ILogHistoryParams } from "../types/empDatabase";

export const licenseEndPoint = api.injectEndpoints({
  endpoints: (build) => ({
    getLogHistory: build.query<HTTPResponse<ILogHistory[]>, ILogHistoryParams>({
      query: (params) => {
        return {
          url: `/zingHr-operations`,
          params,
        };
      },
      providesTags: () => ["Emp-Database"],
    }),

    createSyncData: build.mutation<unknown, void>({
      query: () => {
        return {
          url: `/employee/zingHr-sync`,
          method: "POST",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully data sync");
        });
      },
      invalidatesTags: () => ["Emp-Database"],
    }),
  }),
});

export const { useGetLogHistoryQuery, useCreateSyncDataMutation } =
  licenseEndPoint;
