import { api } from "../../app/api/api";
import notification from "../../common/utils/Notification";
import asyncWrapper from "../../utils/asyncWrapper";

export const authEndPoint = api.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<void, any>({
      query: (body) => ({
        url: `/auth/register`,
        method: "POST",
        body: body,
      }),
      onQueryStarted: (_arg, { queryFulfilled }) => {
        asyncWrapper(async () => {
          await queryFulfilled;
          notification("success", "Successfully register");
        });
      },
    }),
  }),
});

export const { useRegisterMutation } = authEndPoint;
