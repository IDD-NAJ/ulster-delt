"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  UserGroupIcon,
  BanknotesIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
  { name: "Users", href: "/admin/users", icon: UserGroupIcon },
  { name: "Transactions", href: "/admin/transactions", icon: BanknotesIcon },
  { name: "Analytics", href: "/admin/analytics", icon: ChartBarIcon },
  { name: "Security", href: "/admin/security", icon: ShieldCheckIcon },
  { name: "Notifications", href: "/admin/notifications", icon: BellIcon },
  { name: "Settings", href: "/admin/settings", icon: CogIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-white shadow-sm w-full sm:w-64 sm:h-full border-b sm:border-b-0 sm:border-r fixed sm:static top-0 left-0 z-40">
      <nav className="flex flex-row sm:flex-col overflow-x-auto sm:overflow-visible px-2 sm:px-4 py-2 sm:py-6 gap-1 sm:gap-0">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium rounded-lg whitespace-nowrap",
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-5 w-5 mr-2 sm:mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
} 