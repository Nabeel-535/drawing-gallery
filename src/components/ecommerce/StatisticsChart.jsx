"use client";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function StatisticsChart() {
  const options = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 180,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    grid: {
      show: true,
      borderColor: "#E4E7EC",
      strokeDashArray: 4,
      padding: {
        left: 0,
        right: 0,
        bottom: 0,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.15,
        opacityTo: 0.02,
        stops: [20, 100, 100, 100],
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: "Outfit",
      },
      y: {
        formatter: function (val) {
          return "$" + val;
        },
      },
    },
  };

  const series = [
    {
      name: "Sales",
      data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
    },
  ];

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistics
          </h3>
          <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
            Total sales from all your stores
          </p>
        </div>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-5">
        <div>
          <p className="mb-1 text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Total Sales
          </p>
          <p className="text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-3xl">
            $3287
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.70106 1.75262C5.80414 1.63563 5.95508 1.56182 6.11826 1.56182C6.11856 1.56182 6.11887 1.56182 6.11917 1.56182C6.2683 1.56164 6.41249 1.63651 6.51748 1.75143L9.52256 4.72443C9.74232 4.94402 9.74244 5.30017 9.52283 5.51992C9.30322 5.73967 8.94707 5.7398 8.72732 5.5202L6.68576 3.48003L6.68576 10.125C6.68576 10.4357 6.43392 10.6875 6.12326 10.6875C5.8126 10.6875 5.56076 10.4357 5.56076 10.125L5.56076 3.48331L3.52259 5.52019C3.30285 5.73979 2.9467 5.73967 2.7271 5.51994C2.5075 5.3002 2.50761 4.94404 2.72735 4.72444L5.70106 1.75262Z"
              fill="currentColor"
            />
          </svg>
          +10%
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={180}
          />
        </div>
      </div>
    </div>
  );
}