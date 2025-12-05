"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface SystemLog {
  id: string;
  timestamp: string;
  eventType: string;
  userId: string | null;
  userName: string | null;
  action: string;
  details: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  success: boolean;
  errorMessage: string | null;
}

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [logFilter, setLogFilter] = useState<string>("all");

  // Invite form state
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("technician");
  const [inviting, setInviting] = useState(false);
  const [resetingPassword, setResetingPassword] = useState(false);
  const [tempPassword, setTempPassword] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      const result = await response.json();
      
      if (response.ok && result.success) {
        setUsers(result.users);
      } else {
        console.error("Failed to fetch users:", result.error);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchLogs = async (eventType?: string) => {
    try {
      setLoadingLogs(true);
      const url = eventType && eventType !== "all" 
        ? `/api/admin/logs?eventType=${eventType}&limit=50`
        : `/api/admin/logs?limit=50`;
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (response.ok && result.success) {
        setLogs(result.logs);
      } else {
        console.error("Failed to fetch logs:", result.error);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteName.trim() || !inviteEmail.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setInviting(true);
    setTempPassword("");

    try {
      const response = await fetch("/api/users/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: inviteName.trim(),
          email: inviteEmail.trim(),
          role: inviteRole,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(`User invited successfully!\n\nTemporary Password: ${result.temporaryPassword}\n\n(In production, this would be sent via email)`);
        setTempPassword(result.temporaryPassword);
        setInviteName("");
        setInviteEmail("");
        setInviteRole("technician");
        setShowInviteModal(false);
        fetchUsers(); // Refresh users list
      } else {
        alert(`Failed to invite user: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error inviting user:", error);
      alert("An unexpected error occurred while inviting the user.");
    } finally {
      setInviting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;

    if (!confirm(`Are you sure you want to reset the password for ${selectedUser.name || selectedUser.email}?`)) {
      return;
    }

    setResetingPassword(true);
    setTempPassword("");

    try {
      const response = await fetch("/api/admin/password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.id,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(`Password reset successfully!\n\nTemporary Password: ${result.temporaryPassword}\n\n(In production, this would be sent via email)`);
        setTempPassword(result.temporaryPassword);
        setShowPasswordResetModal(false);
        setSelectedUser(null);
      } else {
        alert(`Failed to reset password: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("An unexpected error occurred while resetting the password.");
    } finally {
      setResetingPassword(false);
    }
  };

  const handleLogFilterChange = (filter: string) => {
    setLogFilter(filter);
    fetchLogs(filter);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getEventTypeColor = (eventType: string) => {
    const colors: Record<string, string> = {
      submission: "bg-blue-100 text-blue-800",
      pdf_generation: "bg-purple-100 text-purple-800",
      admin_approval: "bg-green-100 text-green-800",
      auth_event: "bg-yellow-100 text-yellow-800",
      user_management: "bg-orange-100 text-orange-800",
    };
    return colors[eventType] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Admin Dashboard" 
        description="Manage users, view system logs, and configure admin settings"
      />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* User Management Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>User Management</CardTitle>
                <Button 
                  variant="primary" 
                  onClick={() => setShowInviteModal(true)}
                >
                  + Invite New User
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              {loadingUsers ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading users...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === "admin" 
                                ? "bg-purple-100 text-purple-800" 
                                : "bg-blue-100 text-blue-800"
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Button 
                              variant="secondary"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowPasswordResetModal(true);
                              }}
                            >
                              Reset Password
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardBody>
          </Card>

          {/* System Logs Section */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>System Logs</CardTitle>
                <div className="flex gap-2">
                  <select
                    value={logFilter}
                    onChange={(e) => handleLogFilterChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm"
                  >
                    <option value="all">All Events</option>
                    <option value="submission">Submissions</option>
                    <option value="pdf_generation">PDF Generation</option>
                    <option value="admin_approval">Admin Approvals</option>
                    <option value="auth_event">Auth Events</option>
                    <option value="user_management">User Management</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              {loadingLogs ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading logs...</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No logs found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {logs.map((log) => (
                        <tr key={log.id}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(log.timestamp)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEventTypeColor(log.eventType)}`}>
                              {log.eventType}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {log.action}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.userName || log.userId || "System"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              log.success 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {log.success ? "Success" : "Failed"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {log.errorMessage || (() => {
                              try {
                                return log.details ? JSON.parse(log.details).type || "—" : "—";
                              } catch {
                                return "—";
                              }
                            })()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Admin Stamp Configuration (Optional) */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Stamp Configuration</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-gray-600 mb-4">
                Customize the admin stamp that appears on processed documents.
              </p>
              <p className="text-sm text-gray-500 italic">
                Coming soon: Configure stamp text, color, and positioning.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Invite New User</h3>
            <form onSubmit={handleInviteUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  >
                    <option value="technician">Technician</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => setShowInviteModal(false)}
                  disabled={inviting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={inviting}
                  className="flex-1"
                >
                  {inviting ? "Inviting..." : "Invite User"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordResetModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Reset Password</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reset the password for:
            </p>
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{selectedUser.name || "N/A"}</p>
              <p className="text-sm text-gray-600 mt-2">Email</p>
              <p className="font-medium">{selectedUser.email}</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowPasswordResetModal(false);
                  setSelectedUser(null);
                }}
                disabled={resetingPassword}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                variant="primary"
                onClick={handleResetPassword}
                disabled={resetingPassword}
                className="flex-1"
              >
                {resetingPassword ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
