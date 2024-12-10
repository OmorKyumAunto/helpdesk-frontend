import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import notification from "../../../common/utils/Notification";
import asyncWrapper from "../../../utils/asyncWrapper";
import { IAssignCategoryList } from "../types/assignCategoryTypes";

export const assignCategoryEndPoint = api.injectEndpoints({
  endpoints: (build) => ({
    getAssignCategoryList: build.query<
      HTTPResponse<IAssignCategoryList[]>,
      any
    >({
      query: (params) => {
        return {
          url: `/assign-category/after-assign-list`,
          params,
        };
      },
      providesTags: () => ["assign-category"],
    }),
    assignCategory: build.mutation<
      unknown,
      { id: number; body: { category_id: number[] } }
    >({
      query: ({ id, body }) => {
        return {
          url: `/assign-category/${id}`,
          method: "POST",
          body,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully category assigned");
        });
      },
      invalidatesTags: () => ["assign-category"],
    }),
    // UpdateCategory: build.mutation<unknown, { title: string; id: number }>({
    //   query: ({ title, id }) => {
    //     return {
    //       url: `/ticket-category/update/${id}`,
    //       method: "PUT",
    //       body: title,
    //     };
    //   },
    //   onQueryStarted: async (_arg, { queryFulfilled }) => {
    //     asyncWrapper(async () => {
    //       await queryFulfilled;
    //       notification("success", "Successfully category update ");
    //     });
    //   },
    //   invalidatesTags: () => ["category"],
    // }),
    // UpdateCategoryStatus: build.mutation<unknown, { id: number }>({
    //   query: (id) => {
    //     return {
    //       url: `/ticket-category/changeStatus/${id}`,
    //       method: "PUT",
    //     };
    //   },
    //   onQueryStarted: async (_arg, { queryFulfilled }) => {
    //     asyncWrapper(async () => {
    //       await queryFulfilled;
    //       notification("success", "Successfully update category status");
    //     });
    //   },
    //   invalidatesTags: () => ["category"],
    // }),
    // deleteCategory: build.mutation<unknown, number>({
    //   query: (id) => {
    //     return {
    //       url: `/ticket-category/delete/${id}`,
    //       method: "DELETE",
    //     };
    //   },
    //   onQueryStarted: async (_arg, { queryFulfilled }) => {
    //     asyncWrapper(async () => {
    //       await queryFulfilled;
    //       notification("success", "Successfully delete category");
    //     });
    //   },
    //   invalidatesTags: () => ["category"],
    // }),
  }),
});

export const { useGetAssignCategoryListQuery, useAssignCategoryMutation } =
  assignCategoryEndPoint;
