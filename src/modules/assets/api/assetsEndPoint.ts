import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import notification from "../../../common/utils/Notification";
import asyncWrapper from "../../../utils/asyncWrapper";
import { IAsset, IAssetDetails, IAssetParams } from "../types/assetsTypes";

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
    getAllDistributedAsset: build.query<HTTPResponse<any[]>, IAssetParams>({
      query: (params) => {
        return {
          url: `/asset/distributed-asset`,
          params,
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
          notification("success", "Successfully asset create ");
        });
      },
      invalidatesTags: () => ["asset"],
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
          notification("success", "Successfully asset file upload ");
        });
      },
      invalidatesTags: () => ["asset"],
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
          notification("success", "Successfully asset update ");
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
          notification("success", "Successfully asset assign ");
        });
      },
      invalidatesTags: () => ["asset"],
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
          notification("success", "Successfully delete asset");
        });
      },
      invalidatesTags: () => ["asset"],
    }),
  }),
});

export const {
  useGetAssetsQuery,
  useGetAllDistributedAssetQuery,
  useCreateAssetsFileUpdateMutation,
  useGetSingleAssetsQuery,
  useCreateAssetsMutation,
  useAssignEmployeeMutation,
  useUpdateAssetsMutation,
  useDeleteAssetsMutation,
} = assetsEndPoint;
