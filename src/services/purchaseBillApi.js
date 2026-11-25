import { createApi } from "@reduxjs/toolkit/query/react";
import { buildQueryParams } from "../utils/queryParams";
import { createBaseQueryWithAuth } from "./apiBase";

import { serializeQueryArgsWithCompanyId } from '../utils/serializeQueryArgs';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  ? `${import.meta.env.VITE_BACKEND_BASE_URL}/pharmacy/admin/purchase/bill`
  : "/pharmacy/admin/purchase/bill";

export const purchaseBillApi = createApi({
  reducerPath: "purchaseBillApi",
  baseQuery: createBaseQueryWithAuth(baseUrl),
  tagTypes: ["PurchaseBill"],
  endpoints: (builder) => ({
    getBills: builder.query({
      query: ({ page = 1, limit = 10, search = "", status, paymentStatus } = {}) => ({
        url: `/v1/get-all?${buildQueryParams({
          page,
          limit,
          search,
          status,
          paymentStatus,
        })}`,
        method: "GET",
      }),
      providesTags: ["PurchaseBill"],
    }),

    getBillById: builder.query({
      query: (id) => ({
        url: `/v1/get/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "PurchaseBill", id }],
      transformResponse: (response) => response.data || {},
    }),

    createBill: builder.mutation({
      query: (billData) => ({
        url: "/v1/create",
        method: "POST",
        body: billData,
      }),
      invalidatesTags: ["PurchaseBill"],
    }),

    updateBill: builder.mutation({
      query: ({ id, ...billData }) => ({
        url: `/v1/update/${id}`,
        method: "PUT",
        body: billData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PurchaseBill", id },
        "PurchaseBill",
      ],
    }),

    deleteBill: builder.mutation({
      query: (id) => ({
        url: `/v1/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PurchaseBill"],
    }),

    recordPayment: builder.mutation({
      query: ({ id, paidAmount }) => ({
        url: `/v1/${id}/record-payment`,
        method: "POST",
        body: { paidAmount },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PurchaseBill", id },
        "PurchaseBill",
      ],
    }),

    changeBillStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/v1/${id}/change-status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PurchaseBill", id },
        "PurchaseBill",
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBillsQuery,
  useGetBillByIdQuery,
  useCreateBillMutation,
  useUpdateBillMutation,
  useDeleteBillMutation,
  useRecordPaymentMutation,
  useChangeBillStatusMutation,
} = purchaseBillApi;
