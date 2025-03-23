import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import notification from "../../../common/utils/Notification";
import asyncWrapper from "../../../utils/asyncWrapper";
import { IUnit, IUnitWiseAdminList } from "../types/unitTypes";

export const unitEndPoint = api.injectEndpoints({
  endpoints: (build) => ({
    getUnits: build.query<HTTPResponse<IUnit[]>, any>({
      query: (params) => {
        return {
          url: `/asset-unit/list`,
          params,
        };
      },
      providesTags: () => ["unit"],
    }),
    getAdminWiseUnits: build.query<HTTPResponse<IUnitWiseAdminList>, number>({
      query: (id) => {
        return {
          url: `/asset-unit/unit-wise-admin/${id}`,
        };
      },
      providesTags: () => ["unit"],
    }),
    createUnit: build.mutation<unknown, { title: string }>({
      query: (data) => {
        return {
          url: `/asset-unit/add`,
          method: "POST",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully unit create ");
        });
      },
      invalidatesTags: () => ["unit"],
    }),
    UpdateUnit: build.mutation<unknown, { title: string; id: number }>({
      query: ({ title, id }) => {
        return {
          url: `/asset-unit/update/${id}`,
          method: "PUT",
          body: title,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully unit update ");
        });
      },
      invalidatesTags: () => ["unit"],
    }),
    UpdateUnitStatus: build.mutation<unknown, { id: number }>({
      query: (id) => {
        return {
          url: `/asset-unit/changeStatus/${id}`,
          method: "PUT",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully update unit status");
        });
      },
      invalidatesTags: () => ["unit"],
    }),
    deleteUnit: build.mutation<unknown, number>({
      query: (id) => {
        return {
          url: `/asset-unit/delete/${id}`,
          method: "DELETE",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully delete unit");
        });
      },
      invalidatesTags: () => ["unit"],
    }),
  }),
});

export const {
  useGetUnitsQuery,
  useGetAdminWiseUnitsQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useUpdateUnitStatusMutation,
  useDeleteUnitMutation,
} = unitEndPoint;
