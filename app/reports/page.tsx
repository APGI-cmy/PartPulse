"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";

interface Transfer {
  id: string;
  technician: string;
  department: string;
  transferType: string;
  status: 'submitted' | 'processed';
  pdfPath?: string;
  createdAt: string;
}

interface Claim {
  id: string;
  technicianName: string;
  chillerModel: string;
  status?: 'pending' | 'approved' | 'rejected';
  pdfPath?: string;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function ReportsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'transfers' | 'claims'>('transfers');
  
  // Transfers state
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [transfersPagination, setTransfersPagination] = useState<PaginationInfo>({
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [transfersLoading, setTransfersLoading] = useState(true);
  
  // Claims state
  const [claims, setClaims] = useState<Claim[]>([]);
  const [claimsPagination, setClaimsPagination] = useState<PaginationInfo>({
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [claimsLoading, setClaimsLoading] = useState(true);
  
  // Filter state
  const [technicianFilter, setTechnicianFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  
  // Fetch transfers
  const fetchTransfers = async (page = 1) => {
    setTransfersLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        perPage: '10',
      });
      
      if (technicianFilter) params.append('technician', technicianFilter);
      if (statusFilter) params.append('status', statusFilter);
      if (startDateFilter) params.append('startDate', startDateFilter);
      if (endDateFilter) params.append('endDate', endDateFilter);
      
      const response = await fetch(`/api/reports/transfers?${params.toString()}`);
      const result = await response.json();
      
      if (response.ok && result.success) {
        setTransfers(result.data);
        setTransfersPagination(result.pagination);
      }
    } catch (error) {
      console.error('Error fetching transfers:', error);
    } finally {
      setTransfersLoading(false);
    }
  };
  
  // Fetch claims
  const fetchClaims = async (page = 1) => {
    setClaimsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        perPage: '10',
      });
      
      if (technicianFilter) params.append('technician', technicianFilter);
      if (statusFilter) params.append('status', statusFilter);
      if (startDateFilter) params.append('startDate', startDateFilter);
      if (endDateFilter) params.append('endDate', endDateFilter);
      
      const response = await fetch(`/api/reports/claims?${params.toString()}`);
      const result = await response.json();
      
      if (response.ok && result.success) {
        setClaims(result.data);
        setClaimsPagination(result.pagination);
      }
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setClaimsLoading(false);
    }
  };
  
  // Initial load
  useEffect(() => {
    fetchTransfers();
    fetchClaims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Refetch when filters change
  const applyFilters = () => {
    if (activeTab === 'transfers') {
      fetchTransfers(1);
    } else {
      fetchClaims(1);
    }
  };
  
  const clearFilters = () => {
    setTechnicianFilter('');
    setStatusFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
    if (activeTab === 'transfers') {
      fetchTransfers(1);
    } else {
      fetchClaims(1);
    }
  };
  
  // Calculate approval rate with useMemo to avoid unnecessary re-calculations
  const approvalRate = useMemo(() => {
    if (claims.length === 0) return 0;
    return Math.round((claims.filter(c => c.status === 'approved').length / claims.length) * 100);
  }, [claims]);
  
  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'processed':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleDownloadPDF = (pdfPath?: string) => {
    if (pdfPath) {
      window.open(pdfPath, '_blank');
    } else {
      alert('PDF not available for this record.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Reports" 
        description="View and analyze internal transfers and warranty claims"
      />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Technician
                  </label>
                  <input
                    type="text"
                    value={technicianFilter}
                    onChange={(e) => setTechnicianFilter(e.target.value)}
                    placeholder="Search by name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All</option>
                    {activeTab === 'transfers' ? (
                      <>
                        <option value="submitted">Submitted</option>
                        <option value="processed">Processed</option>
                      </>
                    ) : (
                      <>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </>
                    )}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDateFilter}
                    onChange={(e) => setStartDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDateFilter}
                    onChange={(e) => setEndDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button onClick={applyFilters} size="sm">
                  Apply Filters
                </Button>
                <Button onClick={clearFilters} variant="secondary" size="sm">
                  Clear
                </Button>
              </div>
            </CardBody>
          </Card>
          
          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('transfers')}
                  className={`${
                    activeTab === 'transfers'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Internal Transfers
                </button>
                <button
                  onClick={() => setActiveTab('claims')}
                  className={`${
                    activeTab === 'claims'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Warranty Claims
                </button>
              </nav>
            </div>
          </div>
          
          {/* Transfers Table */}
          {activeTab === 'transfers' && (
            <Card>
              <CardHeader>
                <CardTitle>Internal Transfers</CardTitle>
              </CardHeader>
              <CardBody>
                {transfersLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : transfers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No transfers found</div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Technician
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Department
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {transfers.map((transfer) => (
                            <tr key={transfer.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {transfer.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(transfer.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {transfer.technician}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {transfer.department}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(transfer.status)}`}>
                                  {transfer.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button
                                  onClick={() => router.push(`/internal-transfer/${transfer.id}`)}
                                  className="text-primary hover:text-primary-dark"
                                >
                                  View
                                </button>
                                {transfer.pdfPath && (
                                  <button
                                    onClick={() => handleDownloadPDF(transfer.pdfPath)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    PDF
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                      <div className="text-sm text-gray-700">
                        Showing page {transfersPagination.page} of {transfersPagination.totalPages} 
                        ({transfersPagination.total} total)
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => fetchTransfers(transfersPagination.page - 1)}
                          disabled={!transfersPagination.hasPreviousPage}
                          variant="secondary"
                          size="sm"
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={() => fetchTransfers(transfersPagination.page + 1)}
                          disabled={!transfersPagination.hasNextPage}
                          variant="secondary"
                          size="sm"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          )}
          
          {/* Claims Table */}
          {activeTab === 'claims' && (
            <Card>
              <CardHeader>
                <CardTitle>Warranty Claims</CardTitle>
              </CardHeader>
              <CardBody>
                {claimsLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : claims.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No claims found</div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Technician
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Chiller Model
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {claims.map((claim) => (
                            <tr key={claim.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {claim.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(claim.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {claim.technicianName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {claim.chillerModel}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(claim.status || 'pending')}`}>
                                  {claim.status || 'pending'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button
                                  onClick={() => router.push(`/warranty-claims/${claim.id}`)}
                                  className="text-primary hover:text-primary-dark"
                                >
                                  View
                                </button>
                                {claim.pdfPath && (
                                  <button
                                    onClick={() => handleDownloadPDF(claim.pdfPath)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    PDF
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                      <div className="text-sm text-gray-700">
                        Showing page {claimsPagination.page} of {claimsPagination.totalPages} 
                        ({claimsPagination.total} total)
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => fetchClaims(claimsPagination.page - 1)}
                          disabled={!claimsPagination.hasPreviousPage}
                          variant="secondary"
                          size="sm"
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={() => fetchClaims(claimsPagination.page + 1)}
                          disabled={!claimsPagination.hasNextPage}
                          variant="secondary"
                          size="sm"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          )}
          
          {/* Metrics Section */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardBody>
                <h3 className="text-sm font-medium text-gray-500">Total Transfers</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {transfersPagination.total}
                </p>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <h3 className="text-sm font-medium text-gray-500">Total Claims</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {claimsPagination.total}
                </p>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <h3 className="text-sm font-medium text-gray-500">Approval Rate</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {approvalRate}%
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
