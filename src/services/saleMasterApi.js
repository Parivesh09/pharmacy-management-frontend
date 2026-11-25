import { createApi } from "@reduxjs/toolkit/query/react";
import { buildQueryParams } from '../utils/queryParams';
import { createBaseQueryWithAuth } from './apiBase';

import { serializeQueryArgsWithCompanyId } from '../utils/serializeQueryArgs';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  ? `${import.meta.env.VITE_BACKEND_BASE_URL}/pharmacy/admin/master`
  : "/pharmacy/admin/master";

export const saleMasterApi = createApi({
  reducerPath: "saleMasterApi",
  baseQuery: createBaseQueryWithAuth(baseUrl),
  tagTypes: ['SaleMaster'],
  endpoints: (builder) => ({
    getSaleMasters: builder.query({
      query: ({ page = 1, limit, search = '', taxability, natureOfTransaction, status, isActive, companyId } = {}) => ({
        url: `/sale-master/v1/get-sale-master?${buildQueryParams({ page, limit, search, taxability, natureOfTransaction, status, isActive })}`,
        method: 'GET',
      }),
      providesTags: ['SaleMaster'],
    }),

    getSaleMasterById: builder.query({
      query: (id) => ({
        url: `/sale-master/v1/get-sale-master/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'SaleMaster', id }],
      transformResponse: (response) => response.data || {},
    }),

    createSaleMaster: builder.mutation({
      query: (saleMasterData) => ({
        url: '/sale-master/v1/add-sale-master',
        method: 'POST',
        body: saleMasterData,
      }),
      invalidatesTags: ['SaleMaster'],
    }),

    updateSaleMaster: builder.mutation({
      query: ({ id, ...saleMasterData }) => ({
        url: `/sale-master/v1/update-sale-master/${id}`,
        method: 'PUT',
        body: saleMasterData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'SaleMaster', id }, 'SaleMaster'],
    }),

    deleteSaleMaster: builder.mutation({
      query: (id) => ({
        url: `/sale-master/v1/delete-sale-master/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SaleMaster'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSaleMastersQuery,
  useGetSaleMasterByIdQuery,
  useCreateSaleMasterMutation,
  useUpdateSaleMasterMutation,
  useDeleteSaleMasterMutation,
} = saleMasterApi; 