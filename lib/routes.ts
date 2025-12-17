/**
 * Centralized Route Configuration
 * 
 * Single source of truth for all application routes.
 * All navigation MUST reference this file - no hard-coded paths.
 */

export const routes = {
  // Main dashboard (home page)
  dashboard: '/',
  
  // Parts management routes
  parts: '/parts',
  
  // Transfer routes
  transfers: '/transfers',
  transferDetail: (id: string | number) => `/transfers/${id}`,
  transferSuccess: '/transfers/success',
  
  // Warranty routes
  warranty: '/warranty',
  warrantyClaims: '/warranty-claims',
  warrantyClaimDetail: (id: string | number) => `/warranty-claims/${id}`,
  warrantyClaimAdmin: (id: string | number) => `/warranty-claims/${id}/admin`,
  
  // Employee routes
  employees: '/employees',
  
  // User management routes
  userInvite: '/users/invite',
  
  // Reports
  reports: '/reports',
  
  // Settings
  settings: '/settings',
  settingsAdmin: '/settings/admin',
  
  // Auth routes
  signIn: '/auth/signin',
  signOut: '/auth/signout',
} as const;

/**
 * Navigation items for sidebar
 * Maps display names to route paths
 */
export interface NavItem {
  name: string;
  href: string;
  icon: string;
  adminOnly?: boolean;
}

export const navItems: NavItem[] = [
  { name: "Dashboard", href: routes.dashboard, icon: "🏠" },
  { name: "Internal Transfer", href: '/internal-transfer', icon: "→" },
  { name: "Warranty Claims", href: routes.warrantyClaims, icon: "⚠" },
  { name: "Invite", href: routes.userInvite, icon: "✉", adminOnly: true },
  { name: "Reports", href: routes.reports, icon: "📊" },
  { name: "Admin Dashboard", href: routes.settingsAdmin, icon: "🔧", adminOnly: true },
];
