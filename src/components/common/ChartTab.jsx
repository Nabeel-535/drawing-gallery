"use client";

import { useState } from "react";

export default function ChartTab({ tabs, children }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="flex items-center gap-5 mb-5 overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`text-sm font-medium whitespace-nowrap ${activeTab === index
              ? "text-gray-800 dark:text-white/90"
              : "text-gray-500 dark:text-gray-400"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {children[activeTab]}
    </div>
  );
}