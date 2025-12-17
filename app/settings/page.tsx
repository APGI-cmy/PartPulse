"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'system' | 'security' | 'notifications'>('system');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    companyName: "Trane Distribution",
    emailDomain: "partpulse.example.com",
    supportEmail: "support@partpulse.example.com",
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: "8",
    maxLoginAttempts: "5",
    lockoutDuration: "15",
    passwordMinLength: "16",
    requireUppercase: true,
    requireNumber: true,
    requireSpecialChar: true,
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailOnTransferSubmit: true,
    emailOnClaimSubmit: true,
    emailOnClaimApproval: true,
    emailOnUserInvite: true,
    adminNotifyNewTransfer: false,
    adminNotifyNewClaim: true,
  });

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSuccess(null);

    // Simulate API call (in real implementation, this would call an API)
    setTimeout(() => {
      setSuccess("Settings saved successfully!");
      setIsSaving(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Settings" 
        description="Configure system preferences, security policies, and notifications"
      >
        <Button 
          variant="primary"
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </Header>
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('system')}
                  className={`${
                    activeTab === 'system'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  System Settings
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`${
                    activeTab === 'security'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Security
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`${
                    activeTab === 'notifications'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Notifications
                </button>
              </nav>
            </div>
          </div>

          {/* System Settings Tab */}
          {activeTab === 'system' && (
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
              </CardHeader>
              <CardBody className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <Input
                    type="text"
                    value={systemSettings.companyName}
                    onChange={(e) => setSystemSettings({...systemSettings, companyName: e.target.value})}
                    placeholder="Your company name"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    This appears in emails and PDF documents
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Domain
                  </label>
                  <Input
                    type="text"
                    value={systemSettings.emailDomain}
                    onChange={(e) => setSystemSettings({...systemSettings, emailDomain: e.target.value})}
                    placeholder="partpulse.example.com"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Used for email sending and branding
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Email
                  </label>
                  <Input
                    type="email"
                    value={systemSettings.supportEmail}
                    onChange={(e) => setSystemSettings({...systemSettings, supportEmail: e.target.value})}
                    placeholder="support@partpulse.example.com"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Contact email for user support
                  </p>
                </div>

                <div className="pt-4">
                  <Button 
                    variant="secondary"
                    onClick={() => router.push('/settings/admin')}
                  >
                    Advanced Admin Settings →
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Security Settings Tab */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Policies</CardTitle>
              </CardHeader>
              <CardBody className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (hours)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="24"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Users will be logged out after this period of inactivity
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Login Attempts
                  </label>
                  <Input
                    type="number"
                    min="3"
                    max="10"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: e.target.value})}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Account will be locked after this many failed login attempts
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Lockout Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    min="5"
                    max="60"
                    value={securitySettings.lockoutDuration}
                    onChange={(e) => setSecuritySettings({...securitySettings, lockoutDuration: e.target.value})}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    How long accounts remain locked after failed login attempts
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Password Length
                  </label>
                  <Input
                    type="number"
                    min="8"
                    max="32"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: e.target.value})}
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Password Requirements
                  </label>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requireUppercase"
                      checked={securitySettings.requireUppercase}
                      onChange={(e) => setSecuritySettings({...securitySettings, requireUppercase: e.target.checked})}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="requireUppercase" className="ml-2 text-sm text-gray-700">
                      Require at least one uppercase letter
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requireNumber"
                      checked={securitySettings.requireNumber}
                      onChange={(e) => setSecuritySettings({...securitySettings, requireNumber: e.target.checked})}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="requireNumber" className="ml-2 text-sm text-gray-700">
                      Require at least one number
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requireSpecialChar"
                      checked={securitySettings.requireSpecialChar}
                      onChange={(e) => setSecuritySettings({...securitySettings, requireSpecialChar: e.target.checked})}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="requireSpecialChar" className="ml-2 text-sm text-gray-700">
                      Require at least one special character
                    </label>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Notifications Settings Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardBody className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">User Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="emailOnTransferSubmit" className="text-sm text-gray-700">
                          Transfer Submission Confirmation
                        </label>
                        <p className="text-xs text-gray-500">Send email when user submits internal transfer</p>
                      </div>
                      <input
                        type="checkbox"
                        id="emailOnTransferSubmit"
                        checked={notificationSettings.emailOnTransferSubmit}
                        onChange={(e) => setNotificationSettings({...notificationSettings, emailOnTransferSubmit: e.target.checked})}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="emailOnClaimSubmit" className="text-sm text-gray-700">
                          Warranty Claim Submission
                        </label>
                        <p className="text-xs text-gray-500">Send email when user submits warranty claim</p>
                      </div>
                      <input
                        type="checkbox"
                        id="emailOnClaimSubmit"
                        checked={notificationSettings.emailOnClaimSubmit}
                        onChange={(e) => setNotificationSettings({...notificationSettings, emailOnClaimSubmit: e.target.checked})}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="emailOnClaimApproval" className="text-sm text-gray-700">
                          Warranty Claim Decision
                        </label>
                        <p className="text-xs text-gray-500">Send email when claim is approved/rejected</p>
                      </div>
                      <input
                        type="checkbox"
                        id="emailOnClaimApproval"
                        checked={notificationSettings.emailOnClaimApproval}
                        onChange={(e) => setNotificationSettings({...notificationSettings, emailOnClaimApproval: e.target.checked})}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="emailOnUserInvite" className="text-sm text-gray-700">
                          User Invitation
                        </label>
                        <p className="text-xs text-gray-500">Send email when user is invited to the system</p>
                      </div>
                      <input
                        type="checkbox"
                        id="emailOnUserInvite"
                        checked={notificationSettings.emailOnUserInvite}
                        onChange={(e) => setNotificationSettings({...notificationSettings, emailOnUserInvite: e.target.checked})}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Admin Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="adminNotifyNewTransfer" className="text-sm text-gray-700">
                          New Transfer Submitted
                        </label>
                        <p className="text-xs text-gray-500">Notify admins when new transfer is submitted</p>
                      </div>
                      <input
                        type="checkbox"
                        id="adminNotifyNewTransfer"
                        checked={notificationSettings.adminNotifyNewTransfer}
                        onChange={(e) => setNotificationSettings({...notificationSettings, adminNotifyNewTransfer: e.target.checked})}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="adminNotifyNewClaim" className="text-sm text-gray-700">
                          New Warranty Claim Submitted
                        </label>
                        <p className="text-xs text-gray-500">Notify admins when new claim requires review</p>
                      </div>
                      <input
                        type="checkbox"
                        id="adminNotifyNewClaim"
                        checked={notificationSettings.adminNotifyNewClaim}
                        onChange={(e) => setNotificationSettings({...notificationSettings, adminNotifyNewClaim: e.target.checked})}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
