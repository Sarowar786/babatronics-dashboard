// src\redux\api\adminApi.ts
import { baseApi } from './baseApi'

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Merchants
    getMerchants: builder.query({
      query: (params) => ({
        url: '/admin/merchants',
        params: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          search: params?.search,
          plan: params?.plan,
          subscriptionStatus: params?.subscriptionStatus,
        },
      }),
      providesTags: ['Merchants'],
    }),

    getMerchantById: builder.query({
      query: (id: string) => `/admin/merchants/${id}`,
      providesTags: (result, error, id) => [{ type: 'Merchants', id }],
    }),

    updateMerchantSubscription: builder.mutation({
      query: ({
        id,
        data,
      }: {
        id: string
        data: { plan?: string; status?: string }
      }) => ({
        url: `/admin/merchants/${id}/subscription`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Merchants'],
    }),

    suspendMerchant: builder.mutation({
      query: ({ id, reason }: { id: string; reason: string }) => ({
        url: `/admin/merchants/${id}/suspend`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['Merchants'],
    }),

    activateMerchant: builder.mutation({
      query: (id: string) => ({
        url: `/admin/merchants/${id}/activate`,
        method: 'POST',
      }),
      invalidatesTags: ['Merchants'],
    }),

    // Webhooks
    getWebhookEvents: builder.query({
      query: (params) => ({
        url: '/admin/webhooks',
        params: {
          source: params?.source,
          processed: params?.processed,
          page: params?.page || 1,
          limit: params?.limit || 50,
        },
      }),
      providesTags: ['Webhooks'],
    }),

    // API Logs
    getApiLogs: builder.query({
      query: (params) => ({
        url: '/admin/api-logs',
        params: {
          service: params?.service,
          page: params?.page || 1,
          limit: params?.limit || 50,
        },
      }),
      providesTags: ['ApiLogs'],
    }),

    // Filings
    getFailedFilings: builder.query({
      query: () => '/admin/filings/failed',
      providesTags: ['Filings'],
    }),

    retryFiling: builder.mutation({
      query: (id: string) => ({
        url: `/admin/filings/${id}/retry`,
        method: 'POST',
      }),
      invalidatesTags: ['Filings'],
    }),

    // System Health
    getSystemHealth: builder.query({
      query: () => '/admin/health',
      providesTags: ['Health'],
    }),

    // Dashboard Stats (combine multiple endpoints)
    getDashboardStats: builder.query({
      query: () => '/admin/dashboard/stats',
      providesTags: ['Dashboard'],
    }),

    getAdminProfile: builder.query({
      query: () => '/admin/profile',
      providesTags: ['Admin'],
    }),

    updateAdminProfile: builder.mutation({
      query: (data) => ({
        url: '/admin/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Admin'],
    }),

    uploadProfilePhoto: builder.mutation({
      query: (formData) => ({
        url: '/admin/profile/photo',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['Admin'],
    }),

    getProfilePhoto: builder.query({
      query: () => '/admin/profile/photo',
      providesTags: ['Admin'],
    }),

    deleteProfilePhoto: builder.mutation({
      query: () => ({
        url: '/admin/profile/photo',
        method: 'DELETE',
      }),
      invalidatesTags: ['Admin'],
    }),
  }),
})

export const {
  // Merchants
  useGetMerchantsQuery,
  useGetMerchantByIdQuery,
  useUpdateMerchantSubscriptionMutation,
  useSuspendMerchantMutation,
  useActivateMerchantMutation,

  // Webhooks
  useGetWebhookEventsQuery,

  // API Logs
  useGetApiLogsQuery,

  // Filings
  useGetFailedFilingsQuery,
  useRetryFilingMutation,

  // Health
  useGetSystemHealthQuery,

  // Dashboard
  useGetDashboardStatsQuery,

  // Admin Profile
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,

  // Profile Photo
  useUploadProfilePhotoMutation,
  useGetProfilePhotoQuery,
  useDeleteProfilePhotoMutation,
} = adminApi
