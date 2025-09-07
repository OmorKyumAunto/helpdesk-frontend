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
      query: (params) => ({
        url: `/assign-category/after-assign-list`,
        params,
      }),
      providesTags: () => ["assign-category"],
    }),
    assignCategory: build.mutation<
      unknown,
      { id: number; body: { category_id: number[] } }
    >({
      query: ({ id, body }) => ({
        url: `/assign-category/${id}`,
        method: "POST",
        body,
      }),
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully category assigned");
        });
      },
      invalidatesTags: () => ["assign-category"],
    }),
    // New endpoint: user-wise ticket category
    getUserWiseTicketCategory: build.query<
      HTTPResponse<IAssignCategoryList[]>,
      number // user ID
    >({
      query: (id) => ({
        url: `/assign-category/user-wise-ticket-category/${id}`,
      }),
      providesTags: () => ["assign-category"],
    }),
  }),
});

export const {
  useGetAssignCategoryListQuery,
  useAssignCategoryMutation,
  useGetUserWiseTicketCategoryQuery, // <-- new hook
} = assignCategoryEndPoint;
