// src\redux\api\dashboardApi.ts
import { baseApi } from "./baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/admin/dashboard/stats",
      providesTags: ["Dashboard"],
    }),
    getRevenueData: builder.query({
      query: (period: string = "monthly") => `/admin/dashboard/revenue?period=${period}`,
      providesTags: ["Dashboard"],
    }),
    getPlanDistribution: builder.query({
      query: () => "/admin/dashboard/plan-distribution",
      providesTags: ["Dashboard"],
    }),
    getPosDistribution: builder.query({
      query: () => "/admin/dashboard/pos-distribution",
      providesTags: ["Dashboard"],
    }),
    getTopMerchants: builder.query({
      query: (limit: number = 5) => `/admin/merchants/top?limit=${limit}`,
      providesTags: ["Merchants"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRevenueDataQuery,
  useGetPlanDistributionQuery,
  useGetPosDistributionQuery,
  useGetTopMerchantsQuery,
} = dashboardApi;