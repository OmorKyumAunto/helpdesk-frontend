import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import notification from "../../../common/utils/Notification";
import asyncWrapper from "../../../utils/asyncWrapper";
import { ILocation, ILocationParams } from "../types/locationTypes";

export const locationEndPoint = api.injectEndpoints({
  endpoints: (build) => ({
    getLocations: build.query<HTTPResponse<ILocation[]>, ILocationParams>({
      query: (params) => {
        return {
          url: `/location/list`,
          params,
        };
      },
      providesTags: () => ["Location"],
    }),
    getActiveLocations: build.query<HTTPResponse<ILocation[]>, any>({
      query: (params) => {
        return {
          url: `/location/active-list`,
          params,
        };
      },
      providesTags: () => ["Location"],
    }),
    createLocation: build.mutation<
      unknown,
      { unit_id: number; location: string }
    >({
      query: (data) => {
        return {
          url: `/location/add`,
          method: "POST",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully location create ");
        });
      },
      invalidatesTags: () => ["Location"],
    }),
    UpdateLocation: build.mutation<unknown, { location: string; id: number }>({
      query: ({ location, id }) => {
        return {
          url: `/location/update/${id}`,
          method: "PUT",
          body: location,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully location update");
        });
      },
      invalidatesTags: () => ["Location"],
    }),
    UpdateLocationStatus: build.mutation<unknown, { id: number }>({
      query: (id) => {
        return {
          url: `/location/changeStatus/${id}`,
          method: "PUT",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully update location status");
        });
      },
      invalidatesTags: () => ["Location"],
    }),
    deleteLocation: build.mutation<unknown, number>({
      query: (id) => {
        return {
          url: `/location/delete/${id}`,
          method: "DELETE",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully delete location");
        });
      },
      invalidatesTags: () => ["Location"],
    }),
  }),
});

export const {
  useGetLocationsQuery,
  useGetActiveLocationsQuery,
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
  useUpdateLocationStatusMutation,
} = locationEndPoint;
