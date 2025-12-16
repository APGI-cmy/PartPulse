"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "@/lib/routes";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // For MVP, hardcoding user role. Will be replaced with actual auth
  const userRole = "ADMIN"; // or "TECHNICIAN"

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md shadow-lg"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? "✕" : "☰"}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-gray-900 text-white transition-all duration-300 flex flex-col
          fixed lg:static inset-y-0 left-0 z-40
          ${isCollapsed ? "lg:w-16" : "lg:w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          w-64
        `}
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
              className="hidden lg:block text-gray-400 hover:text-white transition-colors"
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
                    onClick={() => setIsMobileOpen(false)}
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
    </>
  );
}
