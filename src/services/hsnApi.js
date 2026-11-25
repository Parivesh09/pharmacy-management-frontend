import { createApi } from "@reduxjs/toolkit/query/react";
import { buildQueryParams } from '../utils/queryParams';
import { createBaseQueryWithAuth } from "./apiBase";

import { serializeQueryArgsWithCompanyId } from '../utils/serializeQueryArgs';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  ? `${import.meta.env.VITE_BACKEND_BASE_URL}/pharmacy/admin/master/inventory`
  : "/api/inventory";

export const hsnApi = createApi({
  reducerPath: "hsnApi",
  baseQuery: createBaseQueryWithAuth(baseUrl),
  endpoints: (builder) => ({
    getHSNs: builder.query({
      query: ({ page = 1, limit, search = '', filters = {}, companyId } = {}) => ({
        url: `/hsn/v1/get-hsn?${buildQueryParams({ page, limit, search, filters })}`,
        method: 'GET',
      }),
      providesTags: ['HSN'],
    }),
    addHSN: builder.mutation({
      query: (hsnData) => ({
        url: "/hsn/v1/add-hsn",
        method: "POST",
        body: hsnData,
      }),
      invalidatesTags: ["HSN"],
    }),
    editHSN: builder.mutation({
      query: ({ id, ...hsnData }) => ({
        url: `/hsn/v1/update-hsn/${id}`,
        method: "PUT",
        body: hsnData,
      }),
      invalidatesTags: ["HSN"],
    }),
    deleteHSN: builder.mutation({
      query: (id) => ({
        url: `/hsn/v1/delete-hsn/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HSN"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetHSNsQuery,
  useAddHSNMutation,
  useEditHSNMutation,
  useDeleteHSNMutation,
} = hsnApi;
