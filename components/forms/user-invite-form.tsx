/**
 * User Invite Form Component
 * Form for inviting new users to the system
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

interface UserInviteFormProps {
  onSuccess?: () => void;
}

export function UserInviteForm({ onSuccess }: UserInviteFormProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('technician');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/users/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || 'Failed to send invitation');
      }

      setEmail('');
      setRole('technician');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Input
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="user@example.com"
      />

      <Select
        label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
        options={[
          { value: 'technician', label: 'Technician' },
          { value: 'admin', label: 'Admin' },
        ]}
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Sending...' : 'Send Invitation'}
      </Button>
    </form>
  );
}

export default UserInviteForm;
