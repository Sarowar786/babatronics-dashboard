// src/redux/api/baseApi.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { RootState } from '../store'
import { logout, setUser } from '../features/authSlice'

// Types
interface RefreshTokenResponse {
  access: string
}

interface ErrorResponse {
  status?: number
  data?: unknown
  message?: string
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

if (!baseUrl) {
  throw new Error('Environment variable NEXT_PUBLIC_BASE_URL is not set')
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState
    const token = state?.auth?.token || null
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  const state = api.getState() as RootState
  const refresh = state?.auth?.refresh_token || null

  if (result.error) {
    const errorData = result.error as ErrorResponse
    // Preserve the full server error response so catch blocks can read
    // err?.data?.message, err?.data?.error, etc.
    result.error = {
      status: errorData?.status || 500,
      data: errorData?.data ?? 'Something went wrong',
    } as FetchBaseQueryError
  }

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: 'auth/token/refresh/',
        method: 'POST',
        body: { refresh },
      },
      api,
      extraOptions,
    )

    if (refreshResult.data) {
      const newToken = (refreshResult.data as RefreshTokenResponse).access
      api.dispatch(setUser({ token: newToken }))
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logout())
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [
    'User',
    'Dashboard',
    'Merchants',
    'Webhooks',
    'ApiLogs',
    'Filings',
    'Health',
    'Admin',
  ],
})
