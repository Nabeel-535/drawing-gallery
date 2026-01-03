import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
// import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
// import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
// import StatisticsChart from "@/components/ecommerce/StatisticsChart";
// import RecentOrders from "@/components/ecommerce/RecentOrders";
// import DemographicCard from "@/components/ecommerce/DemographicCard";

export const metadata = {
  title: "Admin Dashboard | Nabeel's Drawing Gallery",
  description: "Content management dashboard for Nabeel's Drawing Gallery - manage posts, categories, and gallery content",
};

export default function Ecommerce() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white/90">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Manage your drawing gallery content and view statistics
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

        {/* <MonthlySalesChart /> */}
      </div>

      {/* <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div> */}
      </div>
    </>
  );
}