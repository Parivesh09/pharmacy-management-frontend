import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { buildQueryParams } from '../utils/queryParams';

import { createBaseQueryWithAuth } from './apiBase';

import { serializeQueryArgsWithCompanyId } from '../utils/serializeQueryArgs';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  ? `${import.meta.env.VITE_BACKEND_BASE_URL}/pharmacy/admin/master/inventory`
  : '/api/admin/master/inventory';

export const storeApi = createApi({
  reducerPath: 'storeApi',
  baseQuery: createBaseQueryWithAuth(baseUrl),
  endpoints: (builder) => ({
    getStores: builder.query({
      query: ({ page = 1, limit, search = '', filters = {} } = {}, companyId) => ({
        url: `/store/v1/get-store?${buildQueryParams({ page, limit, search, filters })}`,
        method: 'GET',
      }),
      providesTags: ['Store'],
    }),
    addStore: builder.mutation({
      query: (storeData) => ({
        url: '/store/v1/add-store',
        method: 'POST',
        body: storeData,
      }),
      invalidatesTags: ['Store'],
    }),
    deleteStore: builder.mutation({
      query: ({ id, cascade = false }) => ({
        url: `/store/v1/delete-store/${id}${cascade ? '?cascade=true' : ''}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Store'],
    }),
    editStore: builder.mutation({
      query: ({ id, ...storeData }) => ({
        url: `/store/v1/update-store/${id}`,
        method: 'PUT',
        body: storeData,
      }),
      invalidatesTags: ['Store'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStoresQuery,
  useAddStoreMutation,
  useDeleteStoreMutation,
  useEditStoreMutation
} = storeApi; 