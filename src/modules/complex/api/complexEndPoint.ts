import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import notification from "../../../common/utils/Notification";
import asyncWrapper from "../../../utils/asyncWrapper";
import UpdateComplex from "../components/UpdateComplex";
import {
  IComplex,
  IComplexParams,
  IUserUnitBuildingResponse,
} from "../types/complexTypes";

export const complexEndPoint = api.injectEndpoints({
  endpoints: (build) => ({
    getComplexes: build.query<HTTPResponse<IComplex[]>, IComplexParams>({
      query: (params) => {
        return {
          url: `/building/list`,
          params,
        };
      },
      providesTags: () => ["complex"],
    }),
    getUserUnitBuilding: build.query<
      HTTPResponse<IUserUnitBuildingResponse>, // ✅ correct type
      { id: number }
    >({
      query: ({ id }) => `/building/user-unit-building/${id}`,
      providesTags: () => ["complex"],
    }),

    getUnitWiseBuildings: build.query<
      HTTPResponse<IUserUnitBuildingResponse>,
      { id: number[] } // <-- change from number to number[]
    >({
      query: ({ id }) => ({
        url: `/asset-unit/unit-wise-building`,
        method: "POST",
        body: { id }, // send array in body
      }),
      providesTags: () => ["complex"],
    }),

    getActiveComplexes: build.query<HTTPResponse<IComplex[]>, any>({
      query: (params) => {
        return {
          url: `/building/active-list`,
          params,
        };
      },
      providesTags: () => ["complex"],
    }),

    createComplex: build.mutation<unknown, { unit_id: number; name: string }>({
      query: (data) => {
        return {
          url: `/building/add`,
          method: "POST",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully building created ");
        });
      },
      invalidatesTags: () => ["complex"],
    }),
    UpdateComplex: build.mutation<unknown, { name: string; id: number }>({
      query: ({ name, id }) => {
        return {
          url: `/building/update/${id}`,
          method: "PUT",
          body: { name },
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully building updated");
        });
      },
      invalidatesTags: () => ["complex"],
    }),
    UpdateComplexStatus: build.mutation<unknown, { id: number }>({
      query: (id) => {
        return {
          url: `/building/changeStatus/${id}`,
          method: "PUT",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully update location status");
        });
      },
      invalidatesTags: () => ["complex"],
    }),
    deleteComplex: build.mutation<unknown, number>({
      query: (id) => {
        return {
          url: `/building/delete/${id}`,
          method: "DELETE",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully delete building");
        });
      },
      invalidatesTags: () => ["complex"],
    }),
  }),
});

export const {
  useGetComplexesQuery,
  useGetActiveComplexesQuery,
  useGetUserUnitBuildingQuery,
  useGetUnitWiseBuildingsQuery,
  useCreateComplexMutation,
  useUpdateComplexMutation,
  useDeleteComplexMutation,
  useUpdateComplexStatusMutation,
} = complexEndPoint;
