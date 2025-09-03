import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import notification from "../../../common/utils/Notification";
import asyncWrapper from "../../../utils/asyncWrapper";
import { IAdmin, IAdminParams } from "../types/adminTypes";

export const AdminEndPoint = api.injectEndpoints({
  endpoints: (build) => ({
    getAdmins: build.query<HTTPResponse<IAdmin[]>, IAdminParams>({
      query: (params) => {
        return {
          url: `/admin/list`,
          params,
        };
      },
      providesTags: () => ["Admin"],
    }),
    getOverallAdmins: build.query<HTTPResponse<IAdmin[]>, void>({
      query: () => {
        return {
          url: `/employee/all-list`,
        };
      },
      providesTags: () => ["Admin"],
    }),
    getUnitSuperAdminList: build.query<HTTPResponse<IAdmin[]>, IAdminParams>({
      query: (params) => {
        return {
          url: `/unit-super-admin/list`,
          params,
        };
      },
      providesTags: () => ["Admin"],
    }),
    getUnitAdminList: build.query<HTTPResponse<IAdmin[]>, IAdminParams>({
      query: (params) => {
        return {
          url: `/unit-super-admin/admin-list`,
          params,
        };
      },
      providesTags: () => ["Admin"],
    }),
    
    demoteToEmployee: build.mutation<unknown, { id: number }>({
      query: (id) => {
        return {
          url: `/employee/assign-admin-demoted/${id}`,
          method: "POST",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully Demoted To Employee");
        });
      },
      invalidatesTags: () => ["Admin"],
    }),
    promoteToSuperAdmin: build.mutation<unknown, { id: number }>({
      query: (id) => {
        return {
          url: `/employee/promoted-unit-super-admin/${id}`,
          method: "POST",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully promoted to Unit Super Admin");
        });
      },
      invalidatesTags: () => ["Admin"],
    }),
    demoteToUnitAdmin: build.mutation<unknown, { id: number }>({
      query: (id) => {
        return {
          url: `/employee/demoted-unit-super-admin/${id}`,
          method: "POST",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully demote Super Admin to Unit Admin");
        });
      },
      invalidatesTags: () => ["Admin"],
    }),
    assignUnitToAdmin: build.mutation<unknown, { id: number; body: any }>({
      query: ({ id, body }) => {
        return {
          url: `/asset-unit/search-access/${id}`,
          method: "POST",
          body,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully unit assigned");
        });
      },
      invalidatesTags: () => ["Admin"],
    }),
    assignLocationToAdmin: build.mutation<unknown, { id: number; body: { seating_location: number[] } }>({
      query: ({ id, body }) => {
        return {
          url: `/seating-location/assign/${id}`,
          method: "POST",
          body,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully location assigned");
        });
      },
      invalidatesTags: () => ["Admin"],
    }),
  }),
});

export const {
  useGetAdminsQuery,
  useGetOverallAdminsQuery,
  useGetUnitSuperAdminListQuery,
  useGetUnitAdminListQuery,
  useDemoteToEmployeeMutation,
  usePromoteToSuperAdminMutation,
  useDemoteToUnitAdminMutation,
  useAssignUnitToAdminMutation,
  useAssignLocationToAdminMutation,
} = AdminEndPoint;
