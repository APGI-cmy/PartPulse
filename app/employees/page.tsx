"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

export default function EmployeesPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/users");
      const result = await response.json();
      
      if (response.ok && result.success) {
        setUsers(result.users);
      } else {
        setError(result.error || "Failed to fetch employees");
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRoleBadgeClass = (role: string) => {
    return role === "admin" 
      ? "bg-purple-100 text-purple-800" 
      : "bg-blue-100 text-blue-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Employees" 
        description="Manage employee accounts, roles, and access permissions"
      >
        <Button 
          variant="primary"
          onClick={() => router.push('/users/invite')}
        >
          + Invite Employee
        </Button>
      </Header>
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardBody>
                <h3 className="text-sm font-medium text-gray-500">Total Employees</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">{users.length}</p>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <h3 className="text-sm font-medium text-gray-500">Administrators</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <h3 className="text-sm font-medium text-gray-500">Technicians</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'technician').length}
                </p>
              </CardBody>
            </Card>
          </div>

          {/* Employee List */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Directory</CardTitle>
            </CardHeader>
            <CardBody>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading employees...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-red-600 mb-2">Error loading employees</p>
                  <p className="text-sm text-gray-600 mb-4">{error}</p>
                  <Button variant="primary" onClick={fetchEmployees}>
                    Retry
                  </Button>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium mb-2">No employees yet</p>
                  <p className="text-sm mb-4">Invite your first employee to get started</p>
                  <Button variant="primary" onClick={() => router.push('/users/invite')}>
                    + Invite Employee
                  </Button>
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
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                                {(user.name || user.email).charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => router.push(`/settings/admin`)}
                            >
                              Manage
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
        </div>
      </div>
    </div>
  );
}
