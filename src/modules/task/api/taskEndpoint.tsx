import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import notification from "../../../common/utils/Notification";
import asyncWrapper from "../../../utils/asyncWrapper";
import { ITaskList, PostTask } from "../types/taskTypes";

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
  }),
});

export const {
  useGetTaskListQuery,
  useCreateTaskListMutation,
  useUpdateTaskListMutation,
  useDeleteTaskListMutation,
} = TaskEndPoint;
