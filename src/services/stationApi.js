import { createApi } from "@reduxjs/toolkit/query/react";
import { buildQueryParams } from "../utils/queryParams";
import { createBaseQueryWithAuth } from "./apiBase";

import { serializeQueryArgsWithCompanyId } from '../utils/serializeQueryArgs';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  ? `${import.meta.env.VITE_BACKEND_BASE_URL}/pharmacy/admin/master/other`
  : "/api/other";

export const stationApi = createApi({
  reducerPath: "stationApi",
  baseQuery: createBaseQueryWithAuth(baseUrl),
  endpoints: (builder) => ({
    getStations: builder.query({
      query: ({ page = 1, limit, search = "", filters = {}, companyId } = {}) => ({
        url: `/station/v1/get-station?${buildQueryParams({
          page,
          limit,
          search,
          filters,
        })}`,
        method: "GET",
      }),
      providesTags: ["Station"],
    }),
    getStationById: builder.query({
      query: (id) => ({
        url: `/station/v1/get-station/${id}`,
        method: "GET",
      }),
      providesTags: ["StationById"],
    }),
    addStation: builder.mutation({
      query: (data) => ({
        url: `/station/v1/add-station`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Station"],
    }),
    updateStation: builder.mutation({
      query: ({ id, name }) => ({
        url: `/station/v1/update-station/${id}`,
        method: "PUT",
        body: { name },
      }),
      invalidatesTags: ["Station"],
    }),
    deleteStation: builder.mutation({
      query: (id) => ({
        url: `/station/v1/delete-station/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Station"],
    }),
  }),
});

export const {
  useGetStationsQuery,
  useGetStationByIdQuery,
  useAddStationMutation,
  useUpdateStationMutation,
  useDeleteStationMutation,
} = stationApi;
