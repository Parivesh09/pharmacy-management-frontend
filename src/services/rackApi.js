import { createApi } from "@reduxjs/toolkit/query/react";
import { buildQueryParams } from '../utils/queryParams';
import { createBaseQueryWithAuth } from "./apiBase";

import { serializeQueryArgsWithCompanyId } from '../utils/serializeQueryArgs';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  ? `${import.meta.env.VITE_BACKEND_BASE_URL}/pharmacy/admin/master/inventory`
  : "/api/inventory";

export const rackApi = createApi({
  reducerPath: "rackApi",
  baseQuery: createBaseQueryWithAuth(baseUrl),
  endpoints: (builder) => ({
    getRacks: builder.query({
      query: ({ page = 1, limit, search = '', filters = {}, companyId } = {}) => ({
        url: `/rack/v1/get-rack?${buildQueryParams({ page, limit, search, filters })}`,
        method: 'GET',
      }),
      providesTags: ['Rack'],
    }),
    addRack: builder.mutation({
      query: (rackData) => ({
        url: "/rack/v1/add-rack",
        method: "POST",
        body: rackData,
      }),
      invalidatesTags: ["Rack"],
    }),
    editRack: builder.mutation({
      query: ({ id, ...rackData }) => ({
        url: `/rack/v1/update-rack/${id}`,
        method: "PUT",
        body: rackData,
      }),
      invalidatesTags: ["Rack"],
    }),
    deleteRack: builder.mutation({
      query: (id) => ({
        url: `/rack/v1/delete-rack/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Rack"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRacksQuery,
  useAddRackMutation,
  useEditRackMutation,
  useDeleteRackMutation,
} = rackApi;
