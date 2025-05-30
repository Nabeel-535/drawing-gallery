"use client";
import React, { useState, useEffect } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";

export const EcommerceMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalCategories: 0,
    totalPosts: 0,
    loading: true
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Fetch categories and posts data
        const [categoriesResponse, postsResponse] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/posts')
        ]);

        if (categoriesResponse.ok && postsResponse.ok) {
          const categories = await categoriesResponse.json();
          const posts = await postsResponse.json();

          setMetrics({
            totalCategories: categories.length,
            totalPosts: posts?.posts?.length,
            loading: false
          });
        } else {
          console.error('Failed to fetch metrics data');
          setMetrics(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setMetrics(prev => ({ ...prev, loading: false }));
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Total Categories Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Categories
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.loading ? '...' : metrics.totalCategories}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            Active
          </Badge>
        </div>
      </div>
      {/* <!-- Total Categories End --> */}

      {/* <!-- Total Posts Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Posts
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.loading ? '...' : metrics.totalPosts}
            </h4>
          </div>

          <Badge color="primary">
            <ArrowUpIcon className="text-primary-500" />
            Published
          </Badge>
        </div>
      </div>
      {/* <!-- Total Posts End --> */}
    </div>
  );
};