import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import notification from "../../../common/utils/Notification";
import asyncWrapper from "../../../utils/asyncWrapper";
import {
  ISingleTask,
  ITaskItems,
  ITaskList,
  ITaskParams,
  ITaskPost,
  PostTask,
} from "../types/taskTypes";

export const TaskEndPoint = api.injectEndpoints({
  endpoints: (build) => ({
    getTaskList: build.query<HTTPResponse<ITaskList[]>, void>({
      query: () => {
        return {
          url: `/task-category/list`,
        };
      },
      providesTags: () => ["Task"],
    }),
    getSingleTask: build.query<HTTPResponse<ISingleTask>, number>({
      query: (id) => {
        return {
          url: `/task/task-details/${id}`,
        };
      },
      providesTags: () => ["Task"],
    }),
    getSingleSuperAdminTask: build.query<HTTPResponse<ISingleTask>, number>({
      query: (id) => {
        return {
          url: `/task/details/${id}`,
        };
      },
      providesTags: () => ["Task"],
    }),

    createTaskList: build.mutation<unknown, PostTask>({
      query: (data) => {
        return {
          url: `/task-category`,
          method: "POST",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully task list create ");
        });
      },
      invalidatesTags: () => ["Task"],
    }),
    UpdateTaskList: build.mutation<unknown, { body: PostTask; id: number }>({
      query: ({ body, id }) => {
        return {
          url: `/task-category/update/${id}`,
          method: "PUT",
          body,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully task list update");
        });
      },
      invalidatesTags: () => ["Task"],
    }),

    deleteTaskList: build.mutation<unknown, number>({
      query: (id) => {
        return {
          url: `/task-category/delete/${id}`,
          method: "DELETE",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully delete task list");
        });
      },
      invalidatesTags: () => ["Task"],
    }),
    getTaskItems: build.query<HTTPResponse<ITaskItems[]>, ITaskParams>({
      query: (params) => {
        const { category, ...rest } = params;
        const queryString = category
          ?.map((item: number) => `category=${item}`)
          .join("&");
        return {
          url: `/task/list?${queryString}`,
          params: { ...rest },
        };
      },
      providesTags: () => ["Task"],
    }),
    createTask: build.mutation<unknown, ITaskPost>({
      query: (data) => {
        return {
          url: `/task`,
          method: "POST",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully task create");
        });
      },
      invalidatesTags: () => ["Task"],
    }),
    updateTask: build.mutation<unknown, { data: ITaskPost; id: number }>({
      query: ({ data, id }) => {
        return {
          url: `/task/update/${id}`,
          method: "PUT",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully task updated");
        });
      },
      invalidatesTags: () => ["Task"],
    }),
    StartedTask: build.mutation<
      unknown,
      { body: { starred: number }; id: number }
    >({
      query: ({ body, id }) => {
        return {
          url: `/task/starred/${id}`,
          method: "PUT",
          body,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully task star update");
        });
      },
      invalidatesTags: () => ["Task"],
    }),
    StartTask: build.mutation<unknown, number>({
      query: (id) => {
        return {
          url: `/task/task-start/${id}`,
          method: "PUT",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully task started");
        });
      },
      invalidatesTags: () => ["Task"],
    }),
    EndTask: build.mutation<unknown, number>({
      query: (id) => {
        return {
          url: `/task/task-end/${id}`,
          method: "PUT",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully task ended");
        });
      },
      invalidatesTags: () => ["Task"],
    }),
    deleteTask: build.mutation<unknown, number>({
      query: (id) => {
        return {
          url: `/task/delete/${id}`,
          method: "DELETE",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully delete task");
        });
      },
      invalidatesTags: () => ["Task"],
    }),
    getOtherTaskList: build.query<
      HTTPResponse<ITaskItems[]>,
      { assign_to?: number; assign_from_others?: number; category: number[] }
    >({
      query: (params) => {
        const { category, ...rest } = params;
        const queryString = category
          ?.map((item: number) => `category=${item}`)
          .join("&");
        return {
          url: `/task/assign-task?${queryString}`,
          params: { ...rest },
        };
      },
      providesTags: () => ["Task"],
    }),
  }),
});

export const {
  useGetTaskListQuery,
  useGetSingleTaskQuery,
  useGetSingleSuperAdminTaskQuery,
  useGetOtherTaskListQuery,
  useCreateTaskListMutation,
  useUpdateTaskListMutation,
  useDeleteTaskListMutation,
  useGetTaskItemsQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useStartedTaskMutation,
  useStartTaskMutation,
  useEndTaskMutation,
} = TaskEndPoint;
