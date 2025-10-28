// src/modules/announcements/api/announcementEndPoint.ts
import { api } from "../../../app/api/api";
import {
  Announcement,
  AnnouncementListResponse,
} from "../types/announcementTypes";

interface AnnouncementQueryParams {
  limit?: number;
  offset?: number;
}

export const announcementEndPoint = api.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncements: builder.query<AnnouncementListResponse, AnnouncementQueryParams>({
      query: (params) => ({
        url: "/mobile/mobile-announcement-list",
        params,
      }),
      providesTags: ["Admin"],
    }),

    getDashboardAnnouncements: builder.query<AnnouncementListResponse, AnnouncementQueryParams>({
      query: (params) => ({
        url: "/mobile/mobile-announcement",
        params,
      }),
      providesTags: ["Admin"],
    }),

    createAnnouncement: builder.mutation<
      any,
      {
        unit_id: number[];
        title: string;
        description: string;
        announcement_date: string;
        break_time: string;
        priority: "low" | "medium" | "high";
      }
    >({
      query: (data) => ({
        url: "/mobile/send-announcement",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Admin"],
    }),

    deleteAnnouncement: builder.mutation<any, number>({
      query: (id) => ({
        url: `/mobile/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admin"],
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useGetDashboardAnnouncementsQuery,
} = announcementEndPoint;
