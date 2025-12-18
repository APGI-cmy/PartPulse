"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";

interface Invitation {
  id: string;
  email: string;
  name: string;
  role: string;
  accepted: boolean;
  expires: string;
  createdAt: string;
}

interface EmailLog {
  id: string;
  timestamp: string;
  action: string;
  userName: string | null;
  details: {
    targetEmail?: string;
    targetName?: string;
    messageId?: string;
    entityType?: string;
    entityId?: string;
  } | null;
  success: boolean;
  errorMessage: string | null;
}

interface Login {
  timestamp: string;
  userId: string | null;
  userName: string | null;
  email: string | null;
}

interface CommunicationsData {
  invitations: {
    total: number;
    pending: number;
    accepted: number;
    expired: number;
    recent: Invitation[];
  };
  emails: {
    totalSent: number;
    totalFailed: number;
    invitationEmails: number;
    transferEmails: number;
    recentLogs: EmailLog[];
  };
  users: {
    total: number;
    activeToday: number;
    neverLoggedIn: number;
    recentLogins: Login[];
  };
}

export default function CommunicationsMonitoringPage() {
  const [data, setData] = useState<CommunicationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/communications");
      const result = await response.json();

      if (response.ok && result.success) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to fetch data");
      }
    } catch (err) {
      console.error("Error fetching communications data:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string, success?: boolean) => {
    const colors = {
      sent: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      queued: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      expired: "bg-gray-100 text-gray-800",
    };

    const label = success === false ? "failed" : status.split("_").pop() || status;
    const colorClass = colors[label as keyof typeof colors] || "bg-gray-100 text-gray-800";

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {label}
      </span>
    );
  };

  if (loading) {
    return (
      <>
        <Header title="Communications Monitoring" />
        <main className="container mx-auto p-6">
          <div className="text-center py-12">
            <p>Loading communications data...</p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header title="Communications Monitoring" />
        <main className="container mx-auto p-6">
          <div className="text-center py-12 text-red-600">
            <p>Error: {error}</p>
            <button
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </main>
      </>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <Header title="Communications Monitoring" description="Track email delivery, invitations, and user activity" />
      <main className="container mx-auto p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody>
              <div className="text-sm text-gray-600 mb-1">Total Emails Sent</div>
              <div className="text-3xl font-bold text-green-600">
                {data.emails.totalSent}
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <div className="text-sm text-gray-600 mb-1">Failed Emails</div>
              <div className="text-3xl font-bold text-red-600">
                {data.emails.totalFailed}
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <div className="text-sm text-gray-600 mb-1">Active Users Today</div>
              <div className="text-3xl font-bold text-blue-600">
                {data.users.activeToday}
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <div className="text-sm text-gray-600 mb-1">Pending Invitations</div>
              <div className="text-3xl font-bold text-yellow-600">
                {data.invitations.pending}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Invitations Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Invitations Status</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <div className="text-sm text-gray-600">Total</div>
                <div className="text-2xl font-bold">{data.invitations.total}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Pending</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {data.invitations.pending}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Accepted</div>
                <div className="text-2xl font-bold text-green-600">
                  {data.invitations.accepted}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Expired</div>
                <div className="text-2xl font-bold text-gray-600">
                  {data.invitations.expired}
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">Recent Invitations</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name / Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Expires
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.invitations.recent.map((invitation) => {
                    const isExpired = new Date(invitation.expires) < new Date();
                    const status = invitation.accepted
                      ? "accepted"
                      : isExpired
                      ? "expired"
                      : "pending";

                    return (
                      <tr key={invitation.id}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {invitation.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {invitation.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {invitation.role}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(status)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(invitation.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(invitation.expires)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* Email Logs Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Email Activity</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <div className="text-sm text-gray-600">Total Sent</div>
                <div className="text-2xl font-bold text-green-600">
                  {data.emails.totalSent}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Failed</div>
                <div className="text-2xl font-bold text-red-600">
                  {data.emails.totalFailed}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Invitation Emails</div>
                <div className="text-2xl font-bold">{data.emails.invitationEmails}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Transfer Emails</div>
                <div className="text-2xl font-bold">{data.emails.transferEmails}</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Recipient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Message
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.emails.recentLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(log.timestamp)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {log.details?.entityType === "internal_transfer"
                          ? "Transfer Receipt"
                          : log.action.includes("invitation")
                          ? "Invitation"
                          : "System"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {log.details?.targetEmail || log.details?.targetName || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(log.action, log.success)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {log.errorMessage || log.details?.messageId || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* User Activity Section */}
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <div className="text-sm text-gray-600">Total Users</div>
                <div className="text-2xl font-bold">{data.users.total}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Active Today</div>
                <div className="text-2xl font-bold text-green-600">
                  {data.users.activeToday}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Never Logged In</div>
                <div className="text-2xl font-bold text-red-600">
                  {data.users.neverLoggedIn}
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">Recent Logins</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.users.recentLogins.map((login) => (
                    <tr key={`${login.userId}-${login.timestamp}`}>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(login.timestamp)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {login.userName || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {login.email || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </main>
    </>
  );
}
