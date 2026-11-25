import { createApi } from "@reduxjs/toolkit/query/react";
import { buildQueryParams } from "../utils/queryParams";
import { createBaseQueryWithAuth } from "./apiBase";

import { serializeQueryArgsWithCompanyId } from '../utils/serializeQueryArgs';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  ? `${import.meta.env.VITE_BACKEND_BASE_URL}/pharmacy/admin/master`
  : "/pharmacy/admin/master";

export const purchaseMasterApi = createApi({
  reducerPath: "purchaseMasterApi",
  baseQuery: createBaseQueryWithAuth(baseUrl),
  tagTypes: ["PurchaseMaster"],
  endpoints: (builder) => ({
    getPurchaseMasters: builder.query({
      query: ({ page = 1, limit = 100, search = "", companyId } = {}) => ({
        url: `/purchase-master/v1/get-purchase-master?${buildQueryParams({
          page,
          limit,
          search,
        })}`,
        method: "GET",
      }),
      providesTags: ["PurchaseMaster"],
    }),

    getPurchaseMasterById: builder.query({
      query: (id) => ({
        url: `/purchase-master/v1/get-purchase-master/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "PurchaseMaster", id }],
      transformResponse: (response) => response.data || {},
    }),

    createPurchaseMaster: builder.mutation({
      query: (masterData) => ({
        url: "/purchase-master/v1/add-purchase-master",
        method: "POST",
        body: masterData,
      }),
      invalidatesTags: ["PurchaseMaster"],
    }),

    updatePurchaseMaster: builder.mutation({
      query: ({ id, ...masterData }) => ({
        url: `/purchase-master/v1/update-purchase-master/${id}`,
        method: "PUT",
        body: masterData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PurchaseMaster", id },
        "PurchaseMaster",
      ],
    }),

    deletePurchaseMaster: builder.mutation({
      query: (id) => ({
        url: `/purchase-master/v1/delete-purchase-master/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PurchaseMaster"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPurchaseMastersQuery,
  useGetPurchaseMasterByIdQuery,
  useCreatePurchaseMasterMutation,
  useUpdatePurchaseMasterMutation,
  useDeletePurchaseMasterMutation,
} = purchaseMasterApi;
