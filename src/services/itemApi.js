import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { buildQueryParams } from '../utils/queryParams';

import { createBaseQueryWithAuth } from './apiBase';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  ? `${import.meta.env.VITE_BACKEND_BASE_URL}/pharmacy/admin/master/inventory`
  : '/api/admin/master/inventory';

export const itemApi = createApi({
  reducerPath: 'itemApi',
  baseQuery: createBaseQueryWithAuth(baseUrl),
  tagTypes: ['Item'],
  endpoints: (builder) => ({
    getItems: builder.query({
      query: ({ page = 1, limit, search = '', filters = {} } = {}, companyId) => ({
        url: `/item/v1/get-item?${buildQueryParams({ page, limit, search, filters })}`,
        method: 'GET',
      }),
      providesTags: ['Item'],
    }),
    getItemById: builder.query({
      query: (id) => ({
        url: `/item/v1/get-item?filters=${JSON.stringify({ _id: id })}`,
        method: 'GET',
      }),
      transformResponse: (response) => {
        // Handle list response and extract first item
        if (response?.data && Array.isArray(response.data)) {
          return { ...response, data: response.data[0] };
        }
        return response;
      },
      providesTags: (result, error, id) => [{ type: 'Item', id }],
    }),
    addItem: builder.mutation({
      query: (itemData) => ({
        url: '/item/v1/add-item',
        method: 'POST',
        body: itemData,
      }),
      invalidatesTags: ['Item'],
    }),
    updateItem: builder.mutation({
      query: ({ id, ...itemData }) => ({
        url: `/item/v1/update-item/${id}`,
        method: 'PUT',
        body: itemData,
      }),
      invalidatesTags: ['Item'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetItemsQuery, useAddItemMutation, useUpdateItemMutation, useGetItemByIdQuery } = itemApi; 