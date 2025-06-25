import EarningSummaryChart from "@/components/EarningSummaryChart";
import MetricCard from "@/components/MetricCard";
import NewReservationTable from "@/components/NewReservationTable";

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
        <div className=" p-4">
          {/* Total User Card */}
          <MetricCard
            title="Total Revenue"
            value={22500}
            percentageChange={4}
            percentageDirection="up"
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
          <NewReservationTable />
        </div>
      </div>
    </>
  );
};
export default Admin;
