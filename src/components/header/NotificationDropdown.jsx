"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "New Order",
      description: "You have a new order to process",
      time: "2 hours ago",
      type: "order",
    },
    {
      id: 2,
      title: "Payment Received",
      description: "Payment received for order #1234",
      time: "3 hours ago",
      type: "payment",
    },
    {
      id: 3,
      title: "New Message",
      description: "You have a new message from customer",
      time: "5 hours ago",
      type: "message",
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span className="absolute right-2 top-2.5 h-2 w-2 rounded-full bg-primary-500"></span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.85667 17H18.1433C18.6668 17 19.095 16.5718 19.095 16.0483C19.095 15.8244 19.0159 15.6197 18.8577 15.4615L17.381 13.9848V10.3599C17.381 7.3947 15.2063 4.89985 12.3233 4.41424V3.59975C12.3233 3.07622 11.8951 2.64801 11.3716 2.64801C10.8481 2.64801 10.4199 3.07622 10.4199 3.59975V4.41424C7.53686 4.89985 5.36224 7.3947 5.36224 10.3599V13.9848L3.88549 15.4615C3.72729 15.6197 3.64825 15.8244 3.64825 16.0483C3.64825 16.5718 4.07646 17 4.6 17H5.85667ZM11.3716 20.1517C12.4186 20.1517 13.275 19.2953 13.275 18.2483H9.46825C9.46825 19.2953 10.3246 20.1517 11.3716 20.1517Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <h6 className="text-sm font-medium text-gray-800 dark:text-white/90">
              Notifications
            </h6>
            <Link
              href="#"
              className="text-xs font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            >
              Mark all as read
            </Link>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <Link
                key={notification.id}
                href="#"
                className="block border-b border-gray-200 px-4 py-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
              >
                <div className="flex items-start gap-3">
                  <div className="relative mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-500/10">
                    {notification.type === "order" && (
                      <svg
                        className="h-4 w-4 text-primary-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16 6V5.2C16 3.43269 14.5673 2 12.8 2H11.2C9.43269 2 8 3.43269 8 5.2V6H3C2.44772 6 2 6.44772 2 7V20C2 21.6569 3.34315 23 5 23H19C20.6569 23 22 21.6569 22 20V7C22 6.44772 21.5523 6 21 6H16ZM10 5.2C10 4.53726 10.5373 4 11.2 4H12.8C13.4627 4 14 4.53726 14 5.2V6H10V5.2Z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                    {notification.type === "payment" && (
                      <svg
                        className="h-4 w-4 text-primary-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4H20C21.1046 4 22 4.89543 22 6ZM20 8H4V10H20V8ZM4 15V18H20V15H4Z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                    {notification.type === "message" && (
                      <svg
                        className="h-4 w-4 text-primary-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 20.2929L6.29289 17H20C21.1046 17 22 16.1046 22 15V5C22 3.89543 21.1046 3 20 3H4C2.89543 3 2 3.89543 2 5V19C2 19.7957 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H19C19.5523 22 20 21.5523 20 21C20 20.4477 19.5523 20 19 20H5C4.73478 20 4.48043 19.8946 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V18.4142L3 20.2929ZM7 8H17C17.5523 8 18 8.44772 18 9C18 9.55228 17.5523 10 17 10H7C6.44772 10 6 9.55228 6 9C6 8.44772 6.44772 8 7 8ZM7 12H11C11.5523 12 12 12.4477 12 13C12 13.5523 11.5523 14 11 14H7C6.44772 14 6 13.5523 6 13C6 12.4477 6.44772 12 7 12Z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1">
                    <h6 className="mb-1 text-sm font-medium text-gray-800 dark:text-white/90">
                      {notification.title}
                    </h6>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {notification.description}
                    </p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-200 p-2 dark:border-gray-700">
            <Link
              href="#"
              className="block rounded-lg px-4 py-2 text-center text-sm font-medium text-gray-800 hover:bg-gray-50 dark:text-white/90 dark:hover:bg-gray-700/50"
            >
              View All
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}