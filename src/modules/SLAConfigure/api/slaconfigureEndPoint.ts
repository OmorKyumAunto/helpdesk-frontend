import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import notification from "../../../common/utils/Notification";
import asyncWrapper from "../../../utils/asyncWrapper";
import { ISLAConfig, ISLAValue } from "../types/slaconfigureTypes";

export const slaConfigureEndPoint = api.injectEndpoints({
  endpoints: (build) => ({
    getSLAConfigList: build.query<HTTPResponse<ISLAConfig[]>, void>({
      query: () => ({
        url: `/sla-configuration/list`,
      }),
      providesTags: () => ["slaConfig"],
    }),

    updateSLAConfig: build.mutation<
      unknown,
      { id: number; response: ISLAValue; resolve: ISLAValue }
    >({
      query: ({ id, response, resolve }) => ({
        url: `/sla-configuration/${id}`,
        method: "PUT",
        body: {
          response_time_value: response.time,
          response_time_unit: response.unit.toLowerCase(), // Convert to lowercase
          resolve_time_value: resolve.time,
          resolve_time_unit: resolve.unit.toLowerCase(), // Convert to lowercase
        },
      }),
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "SLA Configuration updated successfully");
        });
      },
      invalidatesTags: () => ["slaConfig"],
    }),
  }),
});

export const { useGetSLAConfigListQuery, useUpdateSLAConfigMutation } =
  slaConfigureEndPoint;
