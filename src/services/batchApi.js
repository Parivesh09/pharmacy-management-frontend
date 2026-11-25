import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from "./apiBase";

import { serializeQueryArgsWithCompanyId } from '../utils/serializeQueryArgs';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  ? `${import.meta.env.VITE_BACKEND_BASE_URL}/pharmacy/admin/master/batch`
  : "/pharmacy/admin/master/batch";

export const batchApi = createApi({
  reducerPath: "batchApi",
  baseQuery: createBaseQueryWithAuth(baseUrl),
  tagTypes: ["Batch"],
  endpoints: (builder) => ({
    getBatchesByItem: builder.query({
      query: (itemId) => `/v1/get-by-item/${itemId}`,
      providesTags: ["Batch"],
    }),

    getAllBatches: builder.query({
      query: ({ itemId, status } = {}) => {
        const params = new URLSearchParams();
        if (itemId) params.append("itemId", itemId);
        if (status) params.append("status", status);
        return `/v1/get-all?${params.toString()}`;
      },
      serializeQueryArgs: serializeQueryArgsWithCompanyId,
      providesTags: ["Batch"],
    }),

    getBatchById: builder.query({
      query: (id) => `/v1/get/${id}`,
      providesTags: (result, error, id) => [{ type: "Batch", id }],
    }),

    createBatch: builder.mutation({
      query: (batchData) => ({
        url: "/v1/create",
        method: "POST",
        body: batchData,
      }),
      invalidatesTags: ["Batch"],
    }),

    updateBatchQuantity: builder.mutation({
      query: ({ id, quantity }) => ({
        url: `/v1/update-quantity/${id}`,
        method: "PUT",
        body: { quantity },
      }),
      invalidatesTags: ["Batch"],
    }),

    moveBatchQuantity: builder.mutation({
      query: (batchData) => ({
        url: "/v1/move-quantity",
        method: "POST",
        body: batchData,
      }),
      invalidatesTags: ["Batch"],
    }),

    deleteBatch: builder.mutation({
      query: (id) => ({
        url: `/v1/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Batch"],
    }),
  }),
});

export const {
  useGetBatchesByItemQuery,
  useGetAllBatchesQuery,
  useGetBatchByIdQuery,
  useCreateBatchMutation,
  useUpdateBatchQuantityMutation,
  useMoveBatchQuantityMutation,
  useDeleteBatchMutation,
} = batchApi;
