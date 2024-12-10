import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import notification from "../../../common/utils/Notification";
import asyncWrapper from "../../../utils/asyncWrapper";
import { ICategoryList } from "../types/categoryTypes";

export const categoryEndPoint = api.injectEndpoints({
  endpoints: (build) => ({
    getCategoryList: build.query<HTTPResponse<ICategoryList[]>, any>({
      query: (params) => {
        return {
          url: `/ticket-category/list`,
          params,
        };
      },
      providesTags: () => ["category"],
    }),
    getCategoryActiveList: build.query<HTTPResponse<ICategoryList[]>, any>({
      query: (params) => {
        return {
          url: `/ticket-category/active-list`,
          params,
        };
      },
      providesTags: () => ["category"],
    }),
    createCategory: build.mutation<unknown, { title: string }>({
      query: (data) => {
        return {
          url: `/ticket-category/add`,
          method: "POST",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully category create ");
        });
      },
      invalidatesTags: () => ["category"],
    }),
    UpdateCategory: build.mutation<unknown, { title: string; id: number }>({
      query: ({ title, id }) => {
        return {
          url: `/ticket-category/update/${id}`,
          method: "PUT",
          body: title,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully category update ");
        });
      },
      invalidatesTags: () => ["category"],
    }),
    UpdateCategoryStatus: build.mutation<unknown, { id: number }>({
      query: (id) => {
        return {
          url: `/ticket-category/changeStatus/${id}`,
          method: "PUT",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully update category status");
        });
      },
      invalidatesTags: () => ["category"],
    }),
    deleteCategory: build.mutation<unknown, number>({
      query: (id) => {
        return {
          url: `/ticket-category/delete/${id}`,
          method: "DELETE",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully delete category");
        });
      },
      invalidatesTags: () => ["category"],
    }),
  }),
});

export const {
  useGetCategoryListQuery,
  useGetCategoryActiveListQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useUpdateCategoryStatusMutation,
} = categoryEndPoint;
