import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import notification from "../../../common/utils/Notification";
import asyncWrapper from "../../../utils/asyncWrapper";
import {
  IEmployee,
  IEmployeeParams,
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
      // providesTags: () => [{ type: "employee", id: "list" }],
    }),
    getEmployeesForEmployeePanel: build.query<
      HTTPResponse<IEmployee[]>,
      IEmployeeParams
    >({
      query: (params) => {
        return {
          url: `/employee/employee-list`,
          params,
        };
      },
      providesTags: () => ["employee"],
      // providesTags: () => [{ type: "employee", id: "list" }],
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
      invalidatesTags: () => [
        "employee",
        { type: "dashboardTypes", id: "dashboard" },
      ],
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
      invalidatesTags: () => [
        "employee",
        { type: "dashboardTypes", id: "dashboard" },
      ],
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
      invalidatesTags: () => [
        "employee",
        { type: "dashboardTypes", id: "dashboard" },
      ],
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
      invalidatesTags: () => [
        "employee",
        { type: "dashboardTypes", id: "dashboard" },
      ],
    }),
    UpdateEmployeeSeatingLocation: build.mutation<
      unknown,
      { id: number; data: any }
    >({
      query: ({ id, data }) => {
        return {
          url: `/seating-location/employee-seating-location/${id}`,
          method: "PUT",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          notification(
            "success",
            "Successfully updated employee seating location"
          );
        } catch (err: any) {
          notification(
            "error",
            err?.data?.message || "Failed to update seating location"
          );
        }
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
      invalidatesTags: () => [
        "employee",
        "Admin",
        { type: "dashboardTypes", id: "dashboard" },
      ],
    }),
    UpdateEmployeeStatus: build.mutation<unknown, { id: number }>({
      query: (id) => {
        return {
          url: `/employee/changeStatus/${id}`,
          method: "PUT",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully update employee status");
        });
      },
      invalidatesTags: () => ["employee"],
    }),
    changeEmployeePassword: build.mutation<unknown, any>({
      query: (data) => {
        return {
          url: `/employee/password-change`,
          method: "POST",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully changed employee password");
        });
      },
      invalidatesTags: () => ["employee"],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeesForEmployeePanelQuery,
  useGetOverallEmployeesQuery,
  useCreateEmployeeMutation,
  useCreateEmployeeUploadFileMutation,
  useUpdateEmployeeMutation,
  useGetSingleEmployeeQuery,
  useDeleteEmployeeMutation,
  useEmployeeAssignToAdminMutation,
  useUpdateEmployeeStatusMutation,
  useChangeEmployeePasswordMutation,
  useUpdateEmployeeSeatingLocationMutation,
} = employeeEndPoint;
