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
    demoteToAdmin: build.mutation<unknown, { id: number }>({
      query: (id) => {
        return {
          url: `/employee/assign-admin-demoted/${id}`,
          method: "POST",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully demote admin");
        });
      },
      invalidatesTags: () => ["Admin"],
    }),
    assignUnitToAdmin: build.mutation<unknown, { id: number }>({
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
  }),
});

export const {
  useGetAdminsQuery,
  useGetOverallAdminsQuery,
  useDemoteToAdminMutation,
  useAssignUnitToAdminMutation,
} = AdminEndPoint;
