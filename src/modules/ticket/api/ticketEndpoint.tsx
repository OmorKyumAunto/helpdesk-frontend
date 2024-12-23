import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import notification from "../../../common/utils/Notification";
import asyncWrapper from "../../../utils/asyncWrapper";
import {
  IAdminTicketList,
  ICategoryWiseDashboard,
  ICommentList,
  IRaiseTicketList,
  ITicketDashboardCount,
} from "../types/ticketTypes";

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
    getRaiseTicketAdminWise: build.query<HTTPResponse<IAdminTicketList[]>, any>(
      {
        query: (params) => {
          return {
            url: `/raise-ticket/admin-ticket-list`,
            params,
          };
        },
        providesTags: () => ["ticket"],
      }
    ),
    getCommentData: build.query<HTTPResponse<ICommentList[]>, number>({
      query: (id) => {
        return {
          url: `/raise-ticket/comment-details/${id}`,
        };
      },
      providesTags: () => ["ticket"],
    }),
    getTicketDashboardCount: build.query<
      HTTPResponse<ITicketDashboardCount>,
      void
    >({
      query: () => {
        return {
          url: `/raise-ticket-deshboard/count-data`,
        };
      },
      providesTags: () => ["ticket"],
    }),
    getTopTicketSolver: build.query<HTTPResponse<any>, void>({
      query: () => {
        return {
          url: `/raise-ticket-deshboard/top-solve-ticket`,
        };
      },
      providesTags: () => ["ticket"],
    }),
    getRaiseTicketSuperAdminWise: build.query<
      HTTPResponse<IAdminTicketList[]>,
      any
    >({
      query: (params) => {
        return {
          url: `/raise-ticket/raise-ticket`,
          params,
        };
      },
      providesTags: () => ["ticket"],
    }),
    getCategoryWiseDashboardData: build.query<
      HTTPResponse<ICategoryWiseDashboard[]>,
      void
    >({
      query: () => {
        return {
          url: `/raise-ticket-deshboard/priority-base-ticket`,
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
    createComment: build.mutation<
      unknown,
      { ticket_id: number; comment_text: string }
    >({
      query: (body) => {
        return {
          url: `/raise-ticket/comment`,
          method: "POST",
          body,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully comment posted");
        });
      },
      invalidatesTags: () => ["ticket"],
    }),
    forwardTicket: build.mutation<
      unknown,
      {
        body: { unit_id: number; remarks: string; category_id: number };
        id: number;
      }
    >({
      query: ({ body, id }) => {
        return {
          url: `/raise-ticket/ticket-forword/${id}`,
          method: "POST",
          body,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully ticket forwarded");
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
    UpdateTicketAdminStatus: build.mutation<
      unknown,
      { id: number; body: string }
    >({
      query: ({ id, body }) => {
        return {
          url: `/raise-ticket/admin-update-status/${id}`,
          method: "PUT",
          body,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully update ticket status");
        });
      },
      invalidatesTags: () => ["ticket"],
    }),
    deleteTicket: build.mutation<unknown, number>({
      query: (id) => {
        return {
          url: `/raise-ticket/delete/${id}`,
          method: "DELETE",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully delete ticket");
        });
      },
      invalidatesTags: () => ["ticket"],
    }),
  }),
});

export const {
  useCreateRaiseTicketMutation,
  useCreateCommentMutation,
  useForwardTicketMutation,
  useGetTicketDashboardCountQuery,
  useGetRaiseTicketUserWiseQuery,
  useGetTopTicketSolverQuery,
  useGetCategoryWiseDashboardDataQuery,
  useGetRaiseTicketAdminWiseQuery,
  useGetRaiseTicketSuperAdminWiseQuery,
  useLazyGetCommentDataQuery,
  useUpdateTicketAdminStatusMutation,
  useDeleteTicketMutation,
} = ticketEndpoint;
