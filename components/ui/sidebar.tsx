"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
  name: string;
  href: string;
  icon: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { name: "Internal Transfer", href: "/internal-transfer", icon: "→" },
  { name: "Warranty Claims", href: "/warranty", icon: "⚠" },
  { name: "Invite Members", href: "/users/invite", icon: "+", adminOnly: true },
  { name: "Reports", href: "/reports", icon: "📊" },
  { name: "Settings", href: "/settings", icon: "⚙", adminOnly: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // For MVP, hardcoding user role. Will be replaced with actual auth
  const userRole = "ADMIN"; // or "TECHNICIAN"

  return (
    <aside
      className={`bg-gray-900 text-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } min-h-screen flex flex-col`}
    >
      {/* Logo/Brand Section */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold" style={{ color: "#FF2B00" }}>
              PartPulse
            </h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? "→" : "←"}
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            // Hide admin-only items from technicians
            if (item.adminOnly && userRole !== "ADMIN") {
              return null;
            }

            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 transition-colors ${
                    isActive
                      ? "bg-primary text-white font-semibold"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                  style={isActive ? { backgroundColor: "#FF2B00" } : {}}
                  title={isCollapsed ? item.name : undefined}
                >
                  <span className="text-xl w-6">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="ml-3 text-sm">{item.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-800">
        {!isCollapsed ? (
          <div className="mb-3">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">admin@partpulse.com</p>
          </div>
        ) : (
          <div className="mb-3 flex justify-center">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold">
              A
            </div>
          </div>
        )}
        <button
          className="w-full px-3 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded transition-colors"
          onClick={() => alert("Logout functionality will be implemented with NextAuth")}
        >
          {isCollapsed ? "↪" : "Logout"}
        </button>
      </div>
    </aside>
  );
}
