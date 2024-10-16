import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import notification from "../../../common/utils/Notification";
import asyncWrapper from "../../../utils/asyncWrapper";
import { ILicense } from "../types/licenseTypes";

export const licenseEndPoint = api.injectEndpoints({
  endpoints: (build) => ({
    getLicenses: build.query<HTTPResponse<ILicense[]>, any>({
      query: (params) => {
        return {
          url: `/licenses/list`,
          params,
        };
      },
      providesTags: () => ["license"],
    }),
    getActiveLicenses: build.query<HTTPResponse<ILicense[]>, any>({
      query: (params) => {
        return {
          url: `/licenses/active-list`,
          params,
        };
      },
      providesTags: () => ["license"],
    }),
    createLicense: build.mutation<unknown, { title: string; price: number }>({
      query: (data) => {
        return {
          url: `/licenses/add`,
          method: "POST",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully license create ");
        });
      },
      invalidatesTags: () => ["license"],
    }),
    UpdateLicense: build.mutation<unknown, { title: any; id: number }>({
      query: ({ title, id }) => {
        return {
          url: `/licenses/update/${id}`,
          method: "PUT",
          body: title,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully license update ");
        });
      },
      invalidatesTags: () => ["license"],
    }),
    UpdateLicenseStatus: build.mutation<unknown, { id: number }>({
      query: (id) => {
        return {
          url: `/licenses/changeStatus/${id}`,
          method: "PUT",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully update license status");
        });
      },
      invalidatesTags: () => ["license"],
    }),
    deleteLicense: build.mutation<unknown, number>({
      query: (id) => {
        return {
          url: `/licenses/delete/${id}`,
          method: "DELETE",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully delete license");
        });
      },
      invalidatesTags: () => ["license"],
    }),
  }),
});

export const {
  useGetLicensesQuery,
  useCreateLicenseMutation,
  useUpdateLicenseMutation,
  useUpdateLicenseStatusMutation,
  useDeleteLicenseMutation,
} = licenseEndPoint;
