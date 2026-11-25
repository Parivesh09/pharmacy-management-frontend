import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithAuth } from './apiBase';

import { serializeQueryArgsWithCompanyId } from '../utils/serializeQueryArgs';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  ? `${import.meta.env.VITE_BACKEND_BASE_URL}/pharmacy/sales/bills/v1`
  : "/api/sales/bills";

export const posApi = createApi({
  reducerPath: 'posApi',
  baseQuery: createBaseQueryWithAuth(baseUrl),
  tagTypes: ['POSBill', 'HeldBills', 'TodaySummary'],
  endpoints: (builder) => ({
    createQuickSale: builder.mutation({
      query: (saleData) => ({
        url: '/quick-sale',
        method: 'POST',
        body: saleData,
      }),
      invalidatesTags: ['POSBill', 'TodaySummary'],
    }),

    getHeldBills: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: `/held?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['HeldBills'],
    }),

    holdBill: builder.mutation({
      query: (billData) => ({
        url: '/hold',
        method: 'POST',
        body: billData,
      }),
      invalidatesTags: ['HeldBills', 'TodaySummary'],
    }),

    releaseHeldBill: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}/release-hold`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['HeldBills', 'POSBill', 'TodaySummary'],
    }),

    getPrintableBill: builder.query({
      query: (id) => ({
        url: `/${id}/print`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'POSBill', id }],
    }),

    getTodaySummary: builder.query({
      query: () => ({
        url: '/summary/today',
        method: 'GET',
      }),
      providesTags: ['TodaySummary'],
    }),
  }),
});

export const {
  useCreateQuickSaleMutation,
  useGetHeldBillsQuery,
  useHoldBillMutation,
  useReleaseHeldBillMutation,
  useGetPrintableBillQuery,
  useGetTodaySummaryQuery,
} = posApi;