import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import { ICTC, ICTCParams } from "../types/ctcTypes";

export const CTCEndPoint = api.injectEndpoints({
  endpoints: (build) => ({
    getAllCTC: build.query<HTTPResponse<ICTC[]>, ICTCParams>({
      query: (params) => {
        return {
          url: `/employee/employee-calculation`,
          params,
        };
      },
      providesTags: () => ["CTC"],
    }),
  }),
});

export const { useGetAllCTCQuery } = CTCEndPoint;
