"use client";
import { useState } from "react";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

const orders = [
  {
    id: "#3456",
    customer: "John Doe",
    product: "Nike Air Max",
    amount: "$235.00",
    status: "Pending",
  },
  {
    id: "#3455",
    customer: "Alice Smith",
    product: "Adidas Ultraboost",
    amount: "$195.00",
    status: "Delivered",
  },
  {
    id: "#3454",
    customer: "Bob Johnson",
    product: "Puma RS-X",
    amount: "$175.00",
    status: "Cancelled",
  },
  {
    id: "#3453",
    customer: "Emma Wilson",
    product: "Reebok Classic",
    amount: "$145.00",
    status: "Delivered",
  },
  {
    id: "#3452",
    customer: "Michael Brown",
    product: "New Balance 990",
    amount: "$205.00",
    status: "Pending",
  },
];

export default function RecentOrders() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between px-5 pt-5 sm:px-6 sm:pt-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Recent Orders
        </h3>

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

      <div className="mt-5 max-w-full overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[600px] table-auto">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Order ID
              </th>
              <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Customer
              </th>
              <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Product
              </th>
              <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Amount
              </th>
              <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-200 last:border-0 dark:border-gray-800"
              >
                <td className="px-5 py-3 text-sm font-medium text-gray-800 dark:text-white/90">
                  {order.id}
                </td>
                <td className="px-5 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {order.customer}
                </td>
                <td className="px-5 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {order.product}
                </td>
                <td className="px-5 py-3 text-sm font-medium text-gray-800 dark:text-white/90">
                  {order.amount}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                      order.status === "Delivered"
                        ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
                        : order.status === "Pending"
                        ? "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-500"
                        : "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}