import { createApi } from "@reduxjs/toolkit/query/react";
import { buildQueryParams } from "../utils/queryParams";
import { createBaseQueryWithAuth } from "./apiBase";

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  ? `${import.meta.env.VITE_BACKEND_BASE_URL}/pharmacy/admin/master`
  : "/pharmacy/admin/master";

export const ledgerApi = createApi({
  reducerPath: "ledgerApi",
  baseQuery: createBaseQueryWithAuth(baseUrl),
  tagTypes: [
    "Ledger",
    "LedgerBalance",
    "LedgerTransactions",
    "LedgerDetails",
    "DefaultLedgers",
  ],
  endpoints: (builder) => ({
    getLedgers: builder.query({
      query: ({
        page = 1,
        limit,
        search = "",
        groupId,
        groupIds,
        balanceType,
        status,
        isActive,
        companyId
      } = {}) => ({
        url: `/ledger/v1/get-ledger?${buildQueryParams({
          page,
          limit,
          search,
          groupId,
          groupIds: groupIds ? groupIds.join(',') : undefined,
          balanceType,
          status,
          isActive,
        })}`,
        method: "GET",
      }),
      providesTags: ["Ledger"],
    }),
    getLedgersByCompanyId: builder.query({
      query: ({
        companyId,
        page = 1,
        limit,
        search = "",
        groupId,
        groupIds, // New parameter for multiple group IDs
        balanceType,
        status,
        isActive,
        userCompanyId
      } = {}) => ({
        url: `/ledger/v1/get-ledger/by-companyId/${companyId}?${buildQueryParams(
          { 
            page, 
            limit, 
            search, 
            groupId, 
            groupIds: groupIds ? groupIds.join(',') : undefined, // Convert array to comma-separated string
            balanceType, 
            status, 
            isActive 
          }
        )}`,
        method: "GET",
      }),
      providesTags: ["Ledger"],
    }),
    getLedgerById: builder.query({
      query: (id) => ({
        url: `/ledger/v1/get-ledger/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Ledger", id }],
      transformResponse: (response) => response.data || {},
    }),

    createLedger: builder.mutation({
      query: (ledgerData) => ({
        url: "/ledger/v1/add-ledger",
        method: "POST",
        body: ledgerData,
      }),
      invalidatesTags: ["Ledger"],
    }),

    updateLedger: builder.mutation({
      query: ({ id, ...ledgerData }) => ({
        url: `/ledger/v1/update-ledger/${id}`,
        method: "PUT",
        body: ledgerData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Ledger", id },
        "Ledger",
      ],
    }),

    deleteLedger: builder.mutation({
      query: (id) => ({
        url: `/ledger/v1/delete-ledger/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Ledger"],
    }),

    getLedgerBalance: builder.query({
      query: ({ id, asOfDate, companyId } = {}) => ({
        url: `/ledger/v1/${id}/balance${
          asOfDate ? `?asOfDate=${asOfDate}` : ""
        }`,
        method: "GET",
      }),
      providesTags: (result, error, { id }) => [{ type: "LedgerBalance", id }],
      transformResponse: (response) => response.data || {},
    }),

    getLedgerTransactions: builder.query({
      query: ({ id, page = 1, limit, startDate, endDate, companyId } = {}) => ({
        url: `/ledger/v1/${id}/transactions?${buildQueryParams({
          page,
          limit,
          startDate,
          endDate,
        })}`,
        method: "GET",
      }),
      providesTags: (result, error, { id }) => [
        { type: "LedgerTransactions", id },
      ],
      transformResponse: (response) => response.data || [],
    }),

    updateOpeningBalance: builder.mutation({
      query: ({ id, openingBalance }) => ({
        url: `/ledger/v1/${id}/opening-balance`,
        method: "PUT",
        body: { openingBalance },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Ledger", id },
        "Ledger",
      ],
    }),

    getLedgerDetails: builder.query({
      query: ({ id, startDate, endDate, page = 1, limit = 50, companyId } = {}) => ({
        url: `/ledger/v1/${id}/details?${buildQueryParams({
          startDate,
          endDate,
          page,
          limit,
        })}`,
        method: "GET",
      }),
      providesTags: (result, error, { id }) => [{ type: "LedgerDetails", id }],
      transformResponse: (response) => response.data || {},
    }),

    getDefaultLedgers: builder.query({
      query: ({ groupId, companyId } = {}) => ({
        url: `/ledger/v1/default-ledgers${
          groupId ? `?groupId=${groupId}&companyId=${companyId}` : `?companyId=${companyId}`
        }`,
        method: "GET",
      }),
      providesTags: ["DefaultLedgers"],
      transformResponse: (response) => response.data || [],
    }),

    getLedgersByGroup: builder.query({
      query: ({ groupId, companyId } = {}) => ({
        url: `/ledger/v1/group/${groupId}?companyId=${companyId}`,
        method: "GET",
      }),
      providesTags: ["Ledger"],
      transformResponse: (response) => response.data || [],
    }),

    validateLedger: builder.mutation({
      query: (data) => ({
        url: "/ledger/v1/validate",
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLedgersQuery,
  useGetLedgersByCompanyIdQuery,
  useGetLedgerByIdQuery,
  useCreateLedgerMutation,
  useUpdateLedgerMutation,
  useDeleteLedgerMutation,
  useGetLedgerBalanceQuery,
  useGetLedgerTransactionsQuery,
  useGetLedgerDetailsQuery,
  useUpdateOpeningBalanceMutation,
  useGetDefaultLedgersQuery,
  useGetLedgersByGroupQuery,
  useValidateLedgerMutation,
} = ledgerApi;
