import { createApi } from "@reduxjs/toolkit/query/react";
import { buildQueryParams } from "../utils/queryParams";
import { createBaseQueryWithAuth } from './apiBase';

import { serializeQueryArgsWithCompanyId } from '../utils/serializeQueryArgs';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  ? `${import.meta.env.VITE_BACKEND_BASE_URL}/pharmacy/admin/master/other`
  : "/api/admin/master/other";

export const doctorApi = createApi({
  reducerPath: "doctorApi",
  baseQuery: createBaseQueryWithAuth(baseUrl),
  tagTypes: ["Doctor"],
  endpoints: (builder) => ({
    getDoctors: builder.query({
      query: ({ page = 1, limit, search = "", filters = {} } = {}, companyId) => ({
        url: `/doctor/v1/get-doctor?${buildQueryParams({
          page,
          limit,
          search,
          filters,
        })}`,
        method: "GET",
      }),
      providesTags: ["Doctor"],
    }),
    getDoctorById: builder.query({
      query: (id) => ({
        url: `/doctor/v1/get-doctor/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Doctor", id }],
    }),
    createDoctor: builder.mutation({
      query: (data) => ({
        url: "/doctor/v1/add-doctor",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Doctor"],
    }),
    updateDoctor: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/doctor/v1/update-doctor/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Doctor"],
    }),
    deleteDoctor: builder.mutation({
      query: (id) => ({
        url: `/doctor/v1/delete-doctor/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Doctor"],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} = doctorApi;
