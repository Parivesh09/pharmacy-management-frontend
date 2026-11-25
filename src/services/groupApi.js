import { createApi } from "@reduxjs/toolkit/query/react";
import { buildQueryParams } from '../utils/queryParams';
import { createBaseQueryWithAuth } from './apiBase';

import { serializeQueryArgsWithCompanyId } from '../utils/serializeQueryArgs';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  ? `${import.meta.env.VITE_BACKEND_BASE_URL}/pharmacy/api`
  : "/api";

export const groupApi = createApi({
  reducerPath: "groupApi",
  baseQuery: createBaseQueryWithAuth(baseUrl),
  tagTypes: ['Group', 'GroupHierarchy', 'GroupPermissions', 'AvailableParents'],
  endpoints: (builder) => ({
    getGroupHierarchy: builder.query({
      query: (companyId) => ({
        url: '/groups/hierarchy',
        method: 'GET',
      }),
      providesTags: ['GroupHierarchy'],
      transformResponse: (response) => response.data || [],
    }),

    getGroups: builder.query({
      query: ({ page = 1, limit, search = '', filters = {} } = {}, companyId) => ({
        url: `/groups?${buildQueryParams({ page, limit, search, filters })}`,
        method: 'GET',
      }),
      providesTags: ['Group'],
      transformResponse: (response) => response.data || [],
    }),

    getGroupsByType: builder.query({
      query: (groupType, companyId) => ({
        url: `/groups/type/${groupType}`,
        method: 'GET',
      }),
      providesTags: ['Group'],
      transformResponse: (response) => response.data || [],
    }),

    getGroupsByParent: builder.query({
      query: (parentId, companyId) => ({
        url: `/groups/parent/${parentId || 'null'}`,
        method: 'GET',
      }),
      providesTags: ['Group'],
      transformResponse: (response) => response.data || [],
    }),

    getAvailableParents: builder.query({
      query: (excludeId, companyId) => ({
        url: `/groups/available-parents${excludeId ? `?exclude=${excludeId}` : ''}`,
        method: 'GET',
      }),
      providesTags: ['AvailableParents'],
      transformResponse: (response) => response.data || [],
    }),

    getGroupById: builder.query({
      query: (id) => ({
        url: `/groups/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Group', id }],
      transformResponse: (response) => response.data,
    }),

    createGroup: builder.mutation({
      query: (groupData) => ({
        url: '/groups',
        method: 'POST',
        body: groupData,
      }),
      invalidatesTags: ['Group', 'GroupHierarchy', 'AvailableParents'],
    }),

    updateGroup: builder.mutation({
      query: ({ id, ...groupData }) => ({
        url: `/groups/${id}`,
        method: 'PUT',
        body: groupData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Group', id },
        'GroupHierarchy', 
        'AvailableParents'
      ],
    }),

    deleteGroup: builder.mutation({
      query: (id) => ({
        url: `/groups/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Group', 'GroupHierarchy', 'AvailableParents'],
    }),

    getGroupPermissions: builder.query({
      query: (groupId, companyId) => ({
        url: `/groups/${groupId}/permissions`,
        method: 'GET',
      }),
      providesTags: (result, error, groupId) => [{ type: 'GroupPermissions', id: groupId }],
      transformResponse: (response) => response.data || [],
    }),

    setGroupPermission: builder.mutation({
      query: ({ groupId, userId, permissions }) => ({
        url: `/groups/${groupId}/permissions/${userId}`,
        method: 'POST',
        body: { permissions },
    }),
      invalidatesTags: (result, error, { groupId }) => [{ type: 'GroupPermissions', id: groupId }],
    }),
  }),
});

export const {
  useGetGroupHierarchyQuery,
  useGetGroupsQuery,
  useGetGroupsByTypeQuery,
  useGetGroupsByParentQuery,
  useGetAvailableParentsQuery,
  useGetGroupByIdQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useGetGroupPermissionsQuery,
  useSetGroupPermissionMutation,
} = groupApi; 