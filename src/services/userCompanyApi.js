import { createApi } from "@reduxjs/toolkit/query/react";
import { buildQueryParams } from "../utils/queryParams";
import { createBaseQueryWithAuth } from "./apiBase";

import { serializeQueryArgsWithCompanyId } from '../utils/serializeQueryArgs';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  ? `${import.meta.env.VITE_BACKEND_BASE_URL}/pharmacy/admin/master`
  : "/api/inventory";

export const userCompanyApi = createApi({
  reducerPath: "userCompanyApi",
  tagTypes: ["UserCompanies"],
  baseQuery: createBaseQueryWithAuth(baseUrl),
  endpoints: (builder) => ({
    getUserCompanies: builder.query({
      query: (userId) =>
        `/inventory/userCompany/v1/get-UserCompanies/${userId}`,
      providesTags: ["UserCompanies"],
    }),
    createUserCompany: builder.mutation({
      query: ({ userId, companyData }) => ({
        url: `/inventory/userCompany/v1/add-UserCompanies/${userId}`,
        method: "POST",
        body: companyData,
      }),
      invalidatesTags: ["UserCompanies"],
    }),
    getCompanyById: builder.query({
      query: (companyId) =>
        `/inventory/userCompany/v1/get-UserCompany/${companyId}`,
      providesTags: ["UserCompanies"],
    }),
    updateCompany: builder.mutation({
      query: ({ companyId, userId, companyData }) => ({
        url: `/inventory/userCompany/v1/update-UserCompany/${companyId}/${userId}`,
        method: "PUT",
        body: companyData,
      }),
      invalidatesTags: ["UserCompanies"],
    }),
    deleteCompany: builder.mutation({
      query: ({ companyId, userId }) => ({
        url: `/inventory/userCompany/v1/${companyId}/delete-UserCompany/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserCompanies"],
    }),
    getAllCompanies: builder.query({
      query: () => `/inventory/userCompany/v1/get-all-user-companies`,
      providesTags: ["UserCompanies"],
    }),
  }),
});

export const {
  useGetUserCompaniesQuery,
  useGetCompanyByIdQuery,
  useUpdateCompanyMutation,
  useCreateUserCompanyMutation,
  useDeleteCompanyMutation,
  useGetAllCompaniesQuery,
} = userCompanyApi;
