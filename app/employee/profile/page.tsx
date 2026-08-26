'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { employeeApi } from '@/lib/api';
import type { EmployeeProfile } from '@/lib/types';
import { EmployeeLayout } from '@/components/employee/EmployeeLayout';
import { ProfileView, EditProfileForm, ProfileSkeleton } from '@/components/employee/ProfileComponents';
import { LoadingState, ErrorState, SuccessState, ConfirmDialog } from '@/components/employee/StateComponents';
import { useRouter } from 'next/navigation';

export default function EmployeeProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      fetchProfile();
    }
  }, [user, authLoading]);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeApi.getProfile();
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        setError(response.error || 'Failed to load profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Partial<{ phone: string; address: string; avatarUrl: string }>) => {
    setSaving(true);
    setError(null);
    try {
      const response = await employeeApi.updateProfile(data);
      if (response.success && response.data) {
        setProfile(response.data);
        setEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(response.error || 'Failed to update profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <EmployeeLayout>
        <LoadingState message="Loading profile..." size="lg" />
      </EmployeeLayout>
    );
  }

  if (!user || user.role !== 'employee') {
    return (
      <EmployeeLayout>
        <ErrorState message="Unauthorized access. Employee role required." />
      </EmployeeLayout>
    );
  }

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
          </div>
          <ProfileSkeleton />
        </div>
      </EmployeeLayout>
    );
  }

  if (error && !profile) {
    return (
      <EmployeeLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
          </div>
          <ErrorState message={error} onRetry={fetchProfile} />
        </div>
      </EmployeeLayout>
    );
  }

  if (!profile) {
    return (
      <EmployeeLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
          </div>
          <ErrorState message="Profile not found" onRetry={fetchProfile} />
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage your personal information</p>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {saveSuccess && (
          <SuccessState
            message="Profile updated successfully"
            onContinue={() => setSaveSuccess(false)}
            className="mb-6"
          />
        )}

        {error && (
          <ErrorState message={error} onRetry={fetchProfile} className="mb-6" />
        )}

        {editing ? (
          <EditProfileForm
            profile={profile}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
            saving={saving}
          />
        ) : (
          <ProfileView profile={profile} />
        )}

        <ConfirmDialog
          isOpen={deleteConfirm}
          onClose={() => setDeleteConfirm(false)}
          onConfirm={() => setDeleteConfirm(false)}
          title="Delete Avatar"
          message="Are you sure you want to remove your profile picture? This action cannot be undone."
          confirmText="Delete"
          variant="danger"
        />
      </div>
    </EmployeeLayout>
  );
}