// src\redux\api\authApi.ts
import { baseApi } from '@/redux/api/baseApi'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/merchants/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: '/merchants/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    verifyEmailOtp: builder.mutation({
      query: (data) => ({
        url: '/merchants/verify-email-otp',
        method: 'POST',
        body: data,
      }),
    }),

    resendOtp: builder.mutation({
      query: (data) => ({
        url: '/merchants/resend-otp',
        method: 'POST',
        body: data,
      }),
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/merchants/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/merchants/reset-password',
        method: 'POST',
        body: data,
      }),
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: '/merchants/change-password',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    setupMerchant: builder.mutation({
      query: (data) => ({
        url: '/merchants/setup-merchant',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    getMe: builder.query({
      query: () => ({
        url: '/merchants/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    getMerchantProfile: builder.query({
      query: () => ({
        url: '/merchants/profile',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

     updateProfile: builder.mutation({
      query: (data) => ({
        url: '/merchants/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    getProfileWithEligibility: builder.query({
      query: () => ({
        url: '/merchants/profile/eligibility',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
})

export const {
  // Auth mutations
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useSetupMerchantMutation,
  useUpdateProfileMutation,

  // Queries
  useGetMeQuery,
  useGetMerchantProfileQuery,
  useGetProfileWithEligibilityQuery,
} = authApi
