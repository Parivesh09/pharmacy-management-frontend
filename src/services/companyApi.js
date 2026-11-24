import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { buildQueryParams } from '../utils/queryParams';
import { createBaseQueryWithAuth } from "./apiBase";

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  ? `${import.meta.env.VITE_BACKEND_BASE_URL}/pharmacy/admin/master/inventory`
  : "/api/inventory";

export const companyApi = createApi({
  reducerPath: "companyApi",
  baseQuery: createBaseQueryWithAuth(baseUrl),
  endpoints: (builder) => ({
    getCompanies: builder.query({
      query: ({ page = 1, limit, search = '', filters = {}, companyId } = {}) => ({
        url: `/company/v1/get-companies?${buildQueryParams({ page, limit, search, filters })}`,
        method: 'GET',
      }),
      providesTags: ['Company'],
    }),
    // getUserCompanies: builder.query({
    //   query: ({ page = 1, limit, search = '', filters = {}, companyId } = {}) => ({
    //     url: `/company/v1/get-user-companies?${buildQueryParams({ page, limit, search, filters })}`,
    //     method: 'GET',
    //   }),
    //   providesTags: ['Company'],
    // }),
    getCompanyById: builder.query({
      query: (id) => ({
        url: `/company/v1/get-company/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Company', id }],
    }),
    addCompany: builder.mutation({
      query: (companyData) => ({
        url: "/company/v1/add-company",
        method: "POST",
        body: companyData,
      }),
      invalidatesTags: ["Company"],
    }),
    updateCompany: builder.mutation({
      query: ({ id, ...companyData }) => ({
        url: `/company/v1/update-company/${id}`,
        method: "PUT",
        body: companyData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Company', id }, 'Company'],
    }),
    deleteCompany: builder.mutation({
      query: (id) => ({
        url: `/company/v1/delete-company/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Company"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCompaniesQuery,
  // useGetUserCompaniesQuery,
  useGetCompanyByIdQuery,
  useAddCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = companyApi;
