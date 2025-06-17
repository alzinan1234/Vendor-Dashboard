import StatCard from "@/components/MetricCard";
import RegistrationTable from "@/components/RegistrationTable";
import ChartCard from "@/components/EarningSummaryChart";
import { Area, ResponsiveContainer } from "recharts";

import EarningSummaryChart from "@/components/EarningSummaryChart";
import MetricCard from "@/components/MetricCard";

const Admin = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <>
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
          {/* Total User Card */}
          <MetricCard
            title="Total Revenue"
            value={22500}
            percentageChange={4}
            percentageDirection="up"
            timePeriodData={months}
          />

          {/* Total Service Provider Card */}
          <MetricCard
            title="Total Service provider"
            value={200}
            percentageChange={4}
            percentageDirection="up" // Assuming it's also up, change to 'down' if needed
            timePeriodData={months}
          />

            <MetricCard
            title="New Registrations"
            value={200}
            percentageChange={4}
            percentageDirection="up" // Assuming it's also up, change to 'down' if needed
            timePeriodData={months}
          />
        </div>

        <div className=" p-4">
          {/* Earning Summary Chart */}
          <div className=" w-full">
      
            {/* Ensure minimum height for chart visibility */}
            <EarningSummaryChart />
          </div>

         
        </div>

        <div className="p-4">
          <RegistrationTable />
        </div>
      </div>
    </>
  );
};
export default Admin;
