import { createApi } from '@reduxjs/toolkit/query/react';
import { buildQueryParams } from '../utils/queryParams';
import { createBaseQueryWithAuth } from './apiBase';

import { serializeQueryArgsWithCompanyId } from '../utils/serializeQueryArgs';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  ? `${import.meta.env.VITE_BACKEND_BASE_URL}/pharmacy/sales/bills/v1`
  : "/api/sales/bills";

export const salesBillApi = createApi({
  reducerPath: 'salesBillApi',
  baseQuery: createBaseQueryWithAuth(baseUrl),
  tagTypes: ['SalesBill'],
  endpoints: (builder) => ({
    getBills: builder.query({
      query: ({ page = 1, limit = 10, search = '', filters = {} } = {}) => ({
        url: `/?${buildQueryParams({ page, limit, search, filters })}`,
        method: 'GET',
      }),
      providesTags: ['SalesBill'],
    }),
    getBill: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'SalesBill', id }],
    }),
    createBill: builder.mutation({
      query: (bill) => ({
        url: '/',
        method: 'POST',
        body: bill,
      }),
      invalidatesTags: ['SalesBill'],
    }),
    updateBill: builder.mutation({
      query: ({ id, ...bill }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: bill,
      }),
      invalidatesTags: ['SalesBill'],
    }),
    deleteBill: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SalesBill'],
    }),
    recordPayment: builder.mutation({
      query: ({ id, ...payment }) => ({
        url: `/${id}/payment`,
        method: 'POST',
        body: payment,
      }),
      invalidatesTags: ['SalesBill'],
    }),
    changeBillStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['SalesBill'],
    }),
  }),
});

export const {
  useGetBillsQuery,
  useGetBillQuery,
  useCreateBillMutation,
  useUpdateBillMutation,
  useDeleteBillMutation,
  useRecordPaymentMutation,
  useChangeBillStatusMutation,
} = salesBillApi; 