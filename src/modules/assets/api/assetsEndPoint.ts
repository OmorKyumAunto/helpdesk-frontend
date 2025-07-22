import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import notification from "../../../common/utils/Notification";
import asyncWrapper from "../../../utils/asyncWrapper";
import {
  IAsset,
  IAssetDetails,
  IAssetParams,
  IDistributedSingle,
} from "../types/assetsTypes";

export const assetsEndPoint = api.injectEndpoints({
  endpoints: (build) => ({
    getAssets: build.query<HTTPResponse<IAsset[]>, IAssetParams>({
      query: (params) => {
        return {
          url: `/asset/list`,
          params,
        };
      },
      providesTags: () => ["asset"],
    }),
    getAssetsForAdmin: build.query<HTTPResponse<IAsset[]>, IAssetParams>({
      query: (params) => {
        return {
          url: `/asset/admin-unit-assign-list`,
          params,
        };
      },
      providesTags: () => ["asset"],
    }),
    getOverallAssets: build.query<HTTPResponse<IAsset[]>, void>({
      query: () => {
        return {
          url: `/asset/all-list`,
        };
      },
      providesTags: () => ["asset"],
    }),
    getAllDistributedAsset: build.query<HTTPResponse<any[]>, IAssetParams>({
      query: (params) => {
        return {
          url: `/asset/distributed-asset`,
          params,
        };
      },
      providesTags: () => ["asset"],
    }),
    getSingleDistributedAsset: build.query<
      HTTPResponse<IDistributedSingle>,
      number
    >({
      query: (id) => {
        return {
          url: `/asset/distributed-details/${id}`,
        };
      },
      providesTags: () => ["asset"],
    }),
    getEmployeeAllDistributedAsset: build.query<
      HTTPResponse<any[]>,
      IAssetParams
    >({
      query: (params) => {
        return {
          url: `/employee/employee-asset-assign-list`,
          params,
        };
      },
      providesTags: () => ["asset"],
    }),
    getEmployeeAsset: build.query<HTTPResponse<any[]>, number>({
      query: (user_id) => ({
        url: `/employee/employee-asset/${user_id}`,
      }),
      providesTags: () => ["asset"],
    }),

    getOverAllDistributedAsset: build.query<HTTPResponse<any[]>, void>({
      query: () => {
        return {
          url: `/asset/all-distributed-asset`,
        };
      },
      providesTags: () => ["asset"],
    }),
    getSingleAssets: build.query<HTTPResponse<IAssetDetails>, number>({
      query: (id) => {
        return {
          url: `/asset/details/${id}`,
        };
      },
      providesTags: () => ["asset"],
    }),
    createAssets: build.mutation<unknown, { data: any }>({
      query: ({ data }) => {
        return {
          url: `/asset/add`,
          method: "POST",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully Created ");
        });
      },
      invalidatesTags: () => [
        "asset",
        { type: "dashboardTypes", id: "dashboard" },
      ],
    }),
    createAssetsFileUpdate: build.mutation<unknown, { data: any }>({
      query: ({ data }) => {
        return {
          url: `/asset/upload-asset`,
          method: "POST",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully Uploaded ");
        });
      },
      invalidatesTags: () => [
        "asset",
        { type: "dashboardTypes", id: "dashboard" },
      ],
    }),
    UpdateAssets: build.mutation<unknown, { data: any; id: number }>({
      query: ({ data, id }) => {
        return {
          url: `/asset/update/${id}`,
          method: "PUT",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully Updated ");
        });
      },
      invalidatesTags: () => [
        "asset",
        "CTC",
        { type: "dashboardTypes", id: "dashboard" },
      ],
    }),
    UpdateAssetStatus: build.mutation<unknown, { id: number }>({
      query: (id) => {
        return {
          url: `/asset/changeStatus/${id}`,
          method: "PUT",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully update asset status");
        });
      },
      invalidatesTags: () => ["asset"],
    }),
    assignEmployee: build.mutation<unknown, { data: any; id: number }>({
      query: ({ data, id }) => {
        return {
          url: `/asset/assign-employee/${id}`,
          method: "PUT",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully Assigned");
        });
      },
      invalidatesTags: () => [
        "asset",
        "CTC",
        { type: "dashboardTypes", id: "dashboard" },
      ],
    }),
    deleteAssets: build.mutation<unknown, number>({
      query: (id) => {
        return {
          url: `/asset/delete/${id}`,
          method: "DELETE",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully Deleted");
        });
      },
      invalidatesTags: () => [
        "asset",
        { type: "dashboardTypes", id: "dashboard" },
      ],
    }),
  }),
});

export const {
  useGetAssetsQuery,
  useGetAssetsForAdminQuery,
  useGetOverallAssetsQuery,
  useGetOverAllDistributedAssetQuery,
  useGetSingleDistributedAssetQuery,
  useGetAllDistributedAssetQuery,
  useCreateAssetsFileUpdateMutation,
  useGetEmployeeAllDistributedAssetQuery,
  useGetEmployeeAssetQuery,
  useGetSingleAssetsQuery,
  useCreateAssetsMutation,
  useAssignEmployeeMutation,
  useUpdateAssetsMutation,
  useDeleteAssetsMutation,
  useUpdateAssetStatusMutation,
} = assetsEndPoint;
