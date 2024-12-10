import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import notification from "../../../common/utils/Notification";
import asyncWrapper from "../../../utils/asyncWrapper";
import { IRaiseTicketList } from "../types/ticketTypes";

export const ticketEndpoint = api.injectEndpoints({
  endpoints: (build) => ({
    getRaiseTicketUserWise: build.query<HTTPResponse<IRaiseTicketList[]>, any>({
      query: (params) => {
        return {
          url: `/raise-ticket/user-wise-ticket`,
          params,
        };
      },
      providesTags: () => ["ticket"],
    }),
    createRaiseTicket: build.mutation<unknown, FormData>({
      query: (body) => {
        return {
          url: `/raise-ticket`,
          method: "POST",
          body,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully ticket raised");
        });
      },
      invalidatesTags: () => ["ticket"],
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

export const { useCreateRaiseTicketMutation, useGetRaiseTicketUserWiseQuery } =
  ticketEndpoint;
