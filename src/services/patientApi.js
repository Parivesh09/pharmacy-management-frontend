import { createApi } from "@reduxjs/toolkit/query/react";
import { buildQueryParams } from "../utils/queryParams";
import { createBaseQueryWithAuth } from "./apiBase";
import { serializeQueryArgsWithCompanyId } from '../utils/serializeQueryArgs';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  ? `${import.meta.env.VITE_BACKEND_BASE_URL}/pharmacy/admin/master/other`
  : "/api/inventory";

export const patientApi = createApi({
  reducerPath: "patientApi",
  baseQuery: createBaseQueryWithAuth(baseUrl),
  endpoints: (builder) => ({
    getPatients: builder.query({
      query: ({ page = 1, limit, search = "", filters = {}, companyId } = {}) => ({
        url: `/patient/v1/get-patient?${buildQueryParams({
          page,
          limit,
          search,
          filters,
        })}`,
        method: "GET",
      }),
      serializeQueryArgs: serializeQueryArgsWithCompanyId,
      providesTags: ["Patient"],
    }),
    addPatient: builder.mutation({
      query: (patientData) => ({
        url: "/patient/v1/add-patient",
        method: "POST",
        body: patientData,
      }),
      invalidatesTags: ["Patient"],
    }),
    editPatient: builder.mutation({
      query: ({ id, ...patientData }) => ({
        url: `/patient/v1/update-patient/${id}`,
        method: "PUT",
        body: patientData,
      }),
      invalidatesTags: ["Patient"],
    }),
    deletePatient: builder.mutation({
      query: (id) => ({
        url: `/patient/v1/delete-patient/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Patient"],
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useAddPatientMutation,
  useEditPatientMutation,
  useDeletePatientMutation,
} = patientApi;