import { api } from "../../app/api/api";
import { HTTPResponse } from "../../app/types/commonTypes";
// import { IExpenseHead } from "../../modules/Configuration/Expense/types/ExpenseTypes";
import { IAccountHead } from "../types/CommonTypes";

export const CommonEndPoint = api.injectEndpoints({
  endpoints: (build) => ({
    getAccountHeadSelect: build.query<HTTPResponse<IAccountHead[]>, void>({
      query: () => {
        return {
          url: `/account/head/select`,
        };
      },
    }),

    getCommonExpenseHead: build.query({
      query: () => {
        return {
          url: `/admin/expense-head`,
        };
      },
      providesTags: () => [{ type: "expense-head", id: "list" }],
    }),
  }),
});

export const {
  useGetAccountHeadSelectQuery,

  useGetCommonExpenseHeadQuery,
} = CommonEndPoint;
