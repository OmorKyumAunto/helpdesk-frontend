import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import notification from "../../../common/utils/Notification";
import asyncWrapper from "../../../utils/asyncWrapper";
import {
  IEmployee,
  IEmployeeParams,
  ISingleEmployee,
  ISubmitData,
} from "../types/employeeTypes";

export const employeeEndPoint = api.injectEndpoints({
  endpoints: (build) => ({
    getEmployees: build.query<HTTPResponse<IEmployee[]>, IEmployeeParams>({
      query: (params) => {
        return {
          url: `/employee/list`,
          params,
        };
      },
      providesTags: () => ["employee"],
    }),
    getOverallEmployees: build.query<HTTPResponse<IEmployee[]>, void>({
      query: () => {
        return {
          url: `/employee/all-list`,
        };
      },
      providesTags: () => ["employee"],
    }),
    getSingleEmployee: build.query<HTTPResponse<IEmployee>, number>({
      query: (id) => {
        return {
          url: `/employee/list/${id}`,
        };
      },
      providesTags: () => ["employee", "s-emp"],
    }),
    createEmployee: build.mutation<unknown, { data: ISubmitData }>({
      query: ({ data }) => {
        return {
          url: `/employee/add`,
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
    createEmployeeUploadFile: build.mutation<unknown, { data: any }>({
      query: ({ data }) => {
        return {
          url: `/employee/upload`,
          method: "POST",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully employee file upload ");
        });
      },
      invalidatesTags: () => ["employee"],
    }),
    UpdateEmployee: build.mutation<unknown, { data: ISubmitData; id: number }>({
      query: ({ data, id }) => {
        return {
          url: `/employee/update/${id}`,
          method: "PUT",
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
    deleteEmployee: build.mutation<unknown, number>({
      query: (id) => {
        return {
          url: `/employee/delete/${id}`,
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
    employeeAssignToAdmin: build.mutation<unknown, number>({
      query: (id) => {
        return {
          url: `/employee/assign-admin/${id}`,
          method: "POST",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully assigned employee as a admin");
        });
      },
      invalidatesTags: () => ["employee"],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetOverallEmployeesQuery,
  useCreateEmployeeMutation,
  useCreateEmployeeUploadFileMutation,
  useUpdateEmployeeMutation,
  useGetSingleEmployeeQuery,
  useDeleteEmployeeMutation,
  useEmployeeAssignToAdminMutation,
} = employeeEndPoint;
