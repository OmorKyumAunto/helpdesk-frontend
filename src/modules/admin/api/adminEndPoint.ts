import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import notification from "../../../common/utils/Notification";
import asyncWrapper from "../../../utils/asyncWrapper";
import { IAdmin, IAdminParams, ISubmitData } from "../types/adminTypes";

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
    getSingleAdmin: build.query<HTTPResponse<IAdmin>, number>({
      query: (id) => {
        return {
          url: `/admin/list/${id}`,
        };
      },
      providesTags: () => ["Admin", "s-emp"],
    }),
    createAdmin: build.mutation<unknown, { data: ISubmitData }>({
      query: ({ data }) => {
        return {
          url: `/admin/add`,
          method: "POST",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully Admin create ");
        });
      },
      invalidatesTags: () => ["Admin"],
    }),
    createAdminUploadFile: build.mutation<unknown, { data: any }>({
      query: ({ data }) => {
        return {
          url: `/admin/upload`,
          method: "POST",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully Admin file upload ");
        });
      },
      invalidatesTags: () => ["Admin"],
    }),
    UpdateAdmin: build.mutation<unknown, { data: ISubmitData; id: number }>({
      query: ({ data, id }) => {
        return {
          url: `/admin/update/${id}`,
          method: "PUT",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully Admin update ");
        });
      },
      invalidatesTags: () => ["Admin"],
    }),
    deleteAdmin: build.mutation<unknown, number>({
      query: (id) => {
        return {
          url: `/admin/delete/${id}`,
          method: "DELETE",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully delete Admin");
        });
      },
      invalidatesTags: () => ["Admin"],
    }),
    AdminAssignToAdmin: build.mutation<unknown, number>({
      query: (id) => {
        return {
          url: `/admin/assign-admin/${id}`,
          method: "POST",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully assigned Admin as a admin");
        });
      },
      invalidatesTags: () => ["Admin"],
    }),
  }),
});

export const {
  useGetAdminsQuery,
  useGetOverallAdminsQuery,
  useCreateAdminMutation,
  useCreateAdminUploadFileMutation,
  useUpdateAdminMutation,
  useGetSingleAdminQuery,
  useDeleteAdminMutation,
  useAdminAssignToAdminMutation,
} = AdminEndPoint;
