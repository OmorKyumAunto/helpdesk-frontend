import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import notification from "../../../common/utils/Notification";
import asyncWrapper from "../../../utils/asyncWrapper";
import { ITaskItems, ITaskList, ITaskPost, PostTask } from "../types/taskTypes";

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
    getTaskItems: build.query<HTTPResponse<ITaskItems[]>, void>({
      query: () => {
        return {
          url: `/task/list`,
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
      { assign_to?: number; assign_from_others?: number }
    >({
      query: (params) => {
        return {
          url: `/task/assign-task`,
          params,
        };
      },
      providesTags: () => ["Task"],
    }),
  }),
});

export const {
  useGetTaskListQuery,
  useGetOtherTaskListQuery,
  useCreateTaskListMutation,
  useUpdateTaskListMutation,
  useDeleteTaskListMutation,
  useGetTaskItemsQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useStartedTaskMutation,
  useStartTaskMutation,
  useEndTaskMutation,
} = TaskEndPoint;
