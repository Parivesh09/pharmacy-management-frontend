import { createApi } from "@reduxjs/toolkit/query/react";
import { buildQueryParams } from '../utils/queryParams';
import { createBaseQueryWithAuth } from "./apiBase";

import { serializeQueryArgsWithCompanyId } from '../utils/serializeQueryArgs';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  ? `${import.meta.env.VITE_BACKEND_BASE_URL}/pharmacy/admin/master/inventory`
  : "/api/inventory";

export const saltApi = createApi({
  reducerPath: "saltApi",
  baseQuery: createBaseQueryWithAuth(baseUrl),
  endpoints: (builder) => ({
    getSalts: builder.query({
      query: ({ page = 1, limit, search = '', filters = {}, companyId } = {}) => ({
        url: `/salt/v1/get-salt?${buildQueryParams({ page, limit, search, filters })}`,
        method: 'GET',
      }),
      providesTags: ['Salt'],
    }),
    addSalt: builder.mutation({
      query: (saltData) => ({
        url: "/salt/v1/add-salt",
        method: "POST",
        body: saltData,
      }),
      invalidatesTags: ["Salt"],
    }),
    editSalt: builder.mutation({
      query: ({ id, ...saltData }) => ({
        url: `/salt/v1/update-salt/${id}`,
        method: "PUT",
        body: saltData,
      }),
      invalidatesTags: ["Salt"],
    }),
    deleteSalt: builder.mutation({
      query: (id) => ({
        url: `/salt/v1/delete-salt/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Salt"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSaltsQuery,
  useAddSaltMutation,
  useEditSaltMutation,
  useDeleteSaltMutation,
} = saltApi;
