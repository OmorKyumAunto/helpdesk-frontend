import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import notification from "../../../common/utils/Notification";
import asyncWrapper from "../../../utils/asyncWrapper";
import {
  ICreateSubTaskCategory,
  ICreateTaskCategory,
  ITaskCategoryList,
  IUpdateSubTaskCategory,
} from "../types/taskConfigTypes";

export const TaskCategoryEndpoint = api.injectEndpoints({
  endpoints: (build) => ({
    getTaskCategory: build.query<HTTPResponse<ITaskCategoryList[]>, void>({
      query: () => {
        return {
          url: `/task-category/list`,
        };
      },
      providesTags: () => ["Task-Category"],
    }),
    createTaskCategory: build.mutation<unknown, ICreateTaskCategory>({
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
          notification("success", "Successfully task category create ");
        });
      },
      invalidatesTags: () => ["Task-Category"],
    }),
    updateTaskCategory: build.mutation<
      unknown,
      { data: ICreateTaskCategory; id: number }
    >({
      query: ({ data, id }) => {
        return {
          url: `/task-category/update/${id}`,
          method: "PUT",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully task category update ");
        });
      },
      invalidatesTags: () => ["Task-Category"],
    }),
    deleteTaskCategory: build.mutation<unknown, number>({
      query: (id) => {
        return {
          url: `/task-category/delete/${id}`,
          method: "DELETE",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully delete task category");
        });
      },
      invalidatesTags: () => ["Task-Category"],
    }),
    createSubTaskCategory: build.mutation<unknown, ICreateSubTaskCategory>({
      query: (data) => {
        return {
          url: `/task-sub-category`,
          method: "POST",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully task sub category create ");
        });
      },
      invalidatesTags: () => ["Task-Category"],
    }),
    updateSubTaskCategory: build.mutation<
      unknown,
      { data: IUpdateSubTaskCategory; id: number }
    >({
      query: ({ data, id }) => {
        return {
          url: `/task-sub-category/update/${id}`,
          method: "PUT",
          body: data,
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully task sub category update ");
        });
      },
      invalidatesTags: () => ["Task-Category"],
    }),
    deleteSubTaskCategory: build.mutation<unknown, number>({
      query: (id) => {
        return {
          url: `/task-sub-category/delete/${id}`,
          method: "DELETE",
        };
      },
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully delete task sub category");
        });
      },
      invalidatesTags: () => ["Task-Category"],
    }),
  }),
});

export const {
  useGetTaskCategoryQuery,
  useCreateTaskCategoryMutation,
  useUpdateTaskCategoryMutation,
  useDeleteTaskCategoryMutation,
  useCreateSubTaskCategoryMutation,
  useUpdateSubTaskCategoryMutation,
  useDeleteSubTaskCategoryMutation,
} = TaskCategoryEndpoint;
