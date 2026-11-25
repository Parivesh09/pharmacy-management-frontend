import { createApi } from "@reduxjs/toolkit/query/react";
import { buildQueryParams } from '../utils/queryParams';
import { createBaseQueryWithAuth } from './apiBase';

import { serializeQueryArgsWithCompanyId } from '../utils/serializeQueryArgs';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  ? `${import.meta.env.VITE_BACKEND_BASE_URL}/pharmacy/admin/master`
  : "/pharmacy/admin/master";

export const ledgerEntryApi = createApi({
  reducerPath: "ledgerEntryApi",
  baseQuery: createBaseQueryWithAuth(baseUrl),
  tagTypes: ['LedgerEntries', 'TransactionSummary'],
  endpoints: (builder) => ({
    createLedgerEntriesFromBill: builder.mutation({
      query: ({ billData, billType }) => ({
        url: '/ledger-entries/create-from-bill',
        method: 'POST',
        body: { billData, billType },
      }),
      invalidatesTags: ['LedgerEntries', 'TransactionSummary'],
    }),

    getLedgerEntriesByBill: builder.query({
      query: (billId, companyId) => ({
        url: `/ledger-entries/by-bill/${billId}`,
        method: 'GET',
      }),
      providesTags: (result, error, billId) => [{ type: 'LedgerEntries', id: billId }],
      transformResponse: (response) => response.data || [],
    }),

    deleteLedgerEntriesForBill: builder.mutation({
      query: (billId) => ({
        url: `/ledger-entries/by-bill/${billId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LedgerEntries', 'TransactionSummary'],
    }),

    updateLedgerEntriesForBill: builder.mutation({
      query: ({ billId, billData, billType }) => ({
        url: `/ledger-entries/by-bill/${billId}`,
        method: 'PUT',
        body: { billData, billType },
      }),
      invalidatesTags: ['LedgerEntries', 'TransactionSummary'],
    }),

    getTransactionSummaryForBill: builder.query({
      query: (billId, companyId) => ({
        url: `/ledger-entries/summary/${billId}`,
        method: 'GET',
      }),
      providesTags: (result, error, billId) => [{ type: 'TransactionSummary', id: billId }],
      transformResponse: (response) => response.data || {},
    }),

    validateBillData: builder.mutation({
      query: (billData, companyId) => ({
        url: '/ledger-entries/validate-bill',
        method: 'POST',
        body: { billData },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateLedgerEntriesFromBillMutation,
  useGetLedgerEntriesByBillQuery,
  useDeleteLedgerEntriesForBillMutation,
  useUpdateLedgerEntriesForBillMutation,
  useGetTransactionSummaryForBillQuery,
  useValidateBillDataMutation,
} = ledgerEntryApi; 