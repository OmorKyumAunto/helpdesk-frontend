import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import notification from "../../../common/utils/Notification";
import asyncWrapper from "../../../utils/asyncWrapper";
import {
  IEmployee,
  IEmployeeParams,
  ISingleEmployee,
  ISubmitData,
} from "../types/assetsTypes";

export const assetsEndPoint = api.injectEndpoints({
  endpoints: (build) => ({
    getAssets: build.query<HTTPResponse<IEmployee[]>, IEmployeeParams>({
      query: (params) => {
        return {
          url: `/admin/employee`,
          params,
        };
      },
      providesTags: () => ["employee"],
    }),
    getSingleAssets: build.query<HTTPResponse<ISingleEmployee>, number>({
      query: (id) => {
        return {
          url: `/admin/employee/${id}`,
        };
      },
      providesTags: () => ["employee", "s-emp"],
    }),
    createAssets: build.mutation<unknown, { data: ISubmitData }>({
      query: ({ data }) => {
        return {
          url: `/admin/employee`,
          method: "POST",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully employee create ");
        });
      },
      invalidatesTags: () => ["employee"],
    }),
    UpdateAssets: build.mutation<unknown, { data: ISubmitData; id: number }>({
      query: ({ data, id }) => {
        return {
          url: `/admin/employee/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully employee update ");
        });
      },
      invalidatesTags: () => ["employee"],
    }),
    deleteAssets: build.mutation<unknown, number>({
      query: (id) => {
        return {
          url: `/admin/employee/${id}`,
          method: "DELETE",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully delete employee");
        });
      },
      invalidatesTags: () => ["employee"],
    }),
  }),
});

export const {
  useGetAssetsQuery,
  useGetSingleAssetsQuery,
  useCreateAssetsMutation,
  useUpdateAssetsMutation,
  useDeleteAssetsMutation,
} = assetsEndPoint;
