import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import { IArea, IDistrict, IDivision, IThana } from "../Type/AddressType";

export const addressEndPoint = api.injectEndpoints({
  endpoints: (build) => ({
    // get all FamTrip list
    getDivision: build.query<HTTPResponse<IDivision[]>, void>({
      query: () => `/common/division`,
      // providesTags: () => [{ type: "division", id: "LIST" }],
    }),

    //   get district data
    getDistrict: build.query<
      HTTPResponse<IDistrict[]>,
      { division_id?: number }
    >({
      query: ({ division_id }) => {
        return {
          url: `/common/district`,
          params: {
            division_id,
          },
        };
      },
      // providesTags: () => [{ type: "division", id: "LIST" }],
    }),

    //   get thana data
    getThana: build.query<
      HTTPResponse<IThana[]>,
      { division_id?: number; district_id?: number }
    >({
      query: ({ division_id, district_id }) => {
        return {
          url: `/common/thana`,
          params: { division_id, district_id },
        };
      },
      // providesTags: () => [{ type: "propertyDetails", id: "LIST" }],
    }),
    //   get area data
    getArea: build.query<HTTPResponse<IArea[]>, { thana_id?: number }>({
      query: ({ thana_id }) => {
        return {
          url: `/common/area`,
          params: {
            thana_id,
          },
        };
      },
    }),
  }),
});

export const {
  useGetDivisionQuery,
  useGetDistrictQuery,
  useGetThanaQuery,
  useGetAreaQuery,
} = addressEndPoint;
