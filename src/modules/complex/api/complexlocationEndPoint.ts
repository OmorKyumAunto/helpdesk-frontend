import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import notification from "../../../common/utils/Notification";
import asyncWrapper from "../../../utils/asyncWrapper";
import UpdateComplexLocation from "../components/UpdateComplexLocation";
import {
  IComplexLocation,
  IComplexLocationParams,
} from "../types/complexlocationTypes";

export const ComplexLocationlocationEndPoint = api.injectEndpoints({
  endpoints: (build) => ({
    getComplexLocations: build.query<
      HTTPResponse<IComplexLocation[]>,
      IComplexLocationParams
    >({
      query: (params) => {
        return {
          url: `/seating-location/list`,
          params,
        };
      },
      providesTags: () => ["complex"],
    }),
    getActiveComplexLocations: build.query<
      HTTPResponse<IComplexLocation[]>,
      any
    >({
      query: (params) => {
        return {
          url: `/seating-location/active-list`,
          params,
        };
      },
      providesTags: () => ["complex"],
    }),
    getBuildingWiseLocation: build.query<
      HTTPResponse<IComplexLocation[]>,
      number[]
    >({
      query: (buildingIds) => ({
        url: `/seating-location/building-wise-location`,
        method: "POST",
        body: {
          building_id: buildingIds,
        },
      }),
      providesTags: () => ["complex"],
    }),

    createComplexLocation: build.mutation<
      unknown,
      { unit_id: number; name: string }
    >({
      query: (data) => {
        return {
          url: `/seating-location/add`,
          method: "POST",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully seating-location created ");
        });
      },
      invalidatesTags: () => ["complex"],
    }),
    UpdateComplexLocation: build.mutation<
      unknown,
      { name: string; id: number }
    >({
      query: ({ name, id }) => {
        return {
          url: `/seating-location/update/${id}`,
          method: "PUT",
          body: { name },
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully seating-location updated");
        });
      },
      invalidatesTags: () => ["complex"],
    }),
    UpdateComplexLocationStatus: build.mutation<unknown, { id: number }>({
      query: (id) => {
        return {
          url: `/seating-location/changeStatus/${id}`,
          method: "PUT",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully update location status");
        });
      },
      invalidatesTags: () => ["complex"],
    }),
    deleteComplexLocation: build.mutation<unknown, number>({
      query: (id) => {
        return {
          url: `/seating-location/delete/${id}`,
          method: "DELETE",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully delete seating-location");
        });
      },
      invalidatesTags: () => ["complex"],
    }),
  }),
});

export const {
  useGetComplexLocationsQuery,
  useGetActiveComplexLocationsQuery,
  useGetBuildingWiseLocationQuery,
  useCreateComplexLocationMutation,
  useUpdateComplexLocationMutation,
  useDeleteComplexLocationMutation,
  useUpdateComplexLocationStatusMutation,
} = ComplexLocationlocationEndPoint;
