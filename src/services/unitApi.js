import { createApi } from "@reduxjs/toolkit/query/react";
import { buildQueryParams } from '../utils/queryParams';
import { createBaseQueryWithAuth } from "./apiBase";

import { serializeQueryArgsWithCompanyId } from '../utils/serializeQueryArgs';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  ? `${import.meta.env.VITE_BACKEND_BASE_URL}/pharmacy/admin/master/inventory`
  : "/api/inventory";

export const unitApi = createApi({
  reducerPath: "unitApi",
  baseQuery: createBaseQueryWithAuth(baseUrl),
  endpoints: (builder) => ({
    getUnits: builder.query({
      query: ({ page = 1, limit, search = '', filters = {}, companyId } = {}) => ({
        url: `/unit/v1/get-unit?${buildQueryParams({ page, limit, search, filters })}`,
        method: 'GET',
      }),
      providesTags: ['Unit'],
    }),
    addUnit: builder.mutation({
      query: (unitData) => ({
        url: "/unit/v1/add-unit",
        method: "POST",
        body: unitData,
      }),
      invalidatesTags: ["Unit"],
    }),
    editUnit: builder.mutation({
      query: ({ id, ...unitData }) => ({
        url: `/unit/v1/update-unit/${id}`,
        method: "PUT",
        body: unitData,
      }),
      invalidatesTags: ["Unit"],
    }),
    deleteUnit: builder.mutation({
      query: (id) => ({
        url: `/unit/v1/delete-unit/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Unit"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUnitsQuery,
  useAddUnitMutation,
  useEditUnitMutation,
  useDeleteUnitMutation,
} = unitApi;
