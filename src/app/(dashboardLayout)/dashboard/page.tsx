"use client";

import PlanChart from "@/components/dashboard/PlanChart";
import PosChart from "@/components/dashboard/PosChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import StatCard from "@/components/dashboard/StatCard";
import TopMerchants from "@/components/dashboard/TopMerchants";
import { Users, TrendingUp, Zap, Wallet } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Merchants"
          value="1,250"
          icon={<Users size={24} className="text-yellow-600" />}
          iconBg="bg-yellow-100"
        />
        <StatCard
          title="Monthly Revenue"
          value="$5,220"
          icon={<Wallet size={24} className="text-teal-600" />}
          iconBg="bg-teal-100"
        />
        <StatCard
          title="Total Transactions"
          value="4,230"
          icon={<TrendingUp size={24} className="text-blue-600" />}
          iconBg="bg-blue-100"
        />
        <StatCard
          title="Total Tax Processed"
          value="$1,250.00"
          icon={<Zap size={24} className="text-cyan-600" />}
          iconBg="bg-cyan-100"
        />
      </div>

      {/* MIDDLE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <RevenueChart />
        </div>
        <TopMerchants />
      </div>

      {/* BOTTOM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PlanChart />
        <PosChart />
      </div>
    </div>
  );
}
