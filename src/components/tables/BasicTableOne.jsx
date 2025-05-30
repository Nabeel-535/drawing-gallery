"use client";
import React from "react";
import ComponentCard from "../common/ComponentCard";

export default function BasicTableOne() {
  const tableData = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Editor",
      status: "Active",
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@example.com",
      role: "User",
      status: "Active",
    },
    {
      id: 5,
      name: "Charlie Wilson",
      email: "charlie@example.com",
      role: "Editor",
      status: "Inactive",
    },
  ];

  return (
    <ComponentCard title="Basic Table">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Role
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {tableData.map((item) => (
              <tr
                key={item.id}
                className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/50"
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                  {item.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {item.email}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {item.role}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${item.status === "Active" ? "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ComponentCard>
  );
}