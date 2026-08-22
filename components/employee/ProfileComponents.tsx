'use client';

import { useState, useCallback } from 'react';
import type { EmployeeProfile, PersonalDetails, JobDetails, SalaryStructure, Document } from '@/lib/types';
import { StatusBadge } from './UIComponents';
import { Skeleton } from './UIComponents';
import { Button, Input, Textarea, Modal } from './StateComponents';

interface ProfileAvatarProps {
  avatarUrl?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  onChange?: (file: File) => void;
}

export function ProfileAvatar({ avatarUrl, name, size = 'md', editable = false, onChange }: ProfileAvatarProps) {
  const sizeClasses = {
    sm: 'h-16 w-16 text-2xl',
    md: 'h-24 w-24 text-3xl',
    lg: 'h-32 w-32 text-4xl',
    xl: 'h-40 w-40 text-5xl',
  };

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onChange?.(file);
    }
  };

  const displayUrl = previewUrl || avatarUrl;

  return (
    <div className="relative inline-block">
      {displayUrl ? (
        <img src={displayUrl} alt={`${name}'s avatar`} className={`${sizeClasses[size]} rounded-full object-cover`} />
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center`}>
          <span className="font-bold text-blue-700 dark:text-blue-300">{name.charAt(0).toUpperCase()}</span>
        </div>
      )}
      {editable && (
        <label className="absolute bottom-0 right-0 p-1 bg-white dark:bg-gray-800 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
        </label>
      )}
    </div>
  );
}

interface ProfileSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ProfileSection({ title, icon, children, className = '' }: ProfileSectionProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">{icon}</div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string | number | undefined | null;
  className?: string;
}

export function DetailRow({ label, value, className = '' }: DetailRowProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-2 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 ${className}`}>
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 w-full sm:w-48 flex-shrink-0">{label}</dt>
      <dd className="text-sm text-gray-900 dark:text-white">
        {value !== undefined && value !== null && value !== '' ? String(value) : <span className="text-gray-400 dark:text-gray-500">—</span>}
      </dd>
    </div>
  );
}

interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  required?: boolean;
  error?: string;
}

export function EditableField({ label, value, onChange, type = 'text', required, error }: EditableFieldProps) {
  if (type === 'textarea') {
    return (
      <Textarea
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        error={error}
        rows={3}
      />
    );
  }

  return (
    <Input
      label={label}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      error={error}
    />
  );
}

export function ProfileView({ profile }: { profile: EmployeeProfile }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <ProfileAvatar avatarUrl={profile.avatarUrl} name={`${profile.personalDetails.firstName} ${profile.personalDetails.lastName}`} size="lg" />
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {profile.personalDetails.firstName} {profile.personalDetails.lastName}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Employee ID: {profile.employeeId}</p>
          <p className="text-gray-500 dark:text-gray-400">{profile.personalDetails.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileSection
          title="Personal Details"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          }
        >
          <DetailRow label="First Name" value={profile.personalDetails.firstName} />
          <DetailRow label="Last Name" value={profile.personalDetails.lastName} />
          <DetailRow label="Email" value={profile.personalDetails.email} />
          <DetailRow label="Phone" value={profile.personalDetails.phone} />
          <DetailRow label="Address" value={profile.personalDetails.address} />
          <DetailRow label="Date of Birth" value={profile.personalDetails.dateOfBirth} />
          <DetailRow label="Gender" value={profile.personalDetails.gender} />
          <DetailRow label="Marital Status" value={profile.personalDetails.maritalStatus} />
          <DetailRow label="Emergency Contact" value={profile.personalDetails.emergencyContact} />
          <DetailRow label="Emergency Phone" value={profile.personalDetails.emergencyPhone} />
        </ProfileSection>

        <ProfileSection
          title="Job Details"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2m4 6h.01M5 20h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z" />
            </svg>
          }
        >
          <DetailRow label="Department" value={profile.jobDetails.department} />
          <DetailRow label="Position" value={profile.jobDetails.position} />
          <DetailRow label="Employment Type" value={profile.jobDetails.employmentType} />
          <DetailRow label="Join Date" value={profile.jobDetails.joinDate} />
          <DetailRow label="Manager" value={profile.jobDetails.managerName} />
          <DetailRow label="Work Location" value={profile.jobDetails.workLocation} />
          <DetailRow label="Employee Grade" value={profile.jobDetails.employeeGrade} />
        </ProfileSection>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileSection
          title="Salary Structure"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 0 0-2.25 2.25v11.25c0 1.032.704 1.873 1.638 2.148a12.061 12.061 0 0 0 3.493 1.074.04.04 0 0 0 .08 0 12.06 12.06 0 0 0 3.493-1.074A2.244 2.244 0 0 0 18 16.5V3m-14.25 0h14.25" />
            </svg>
          }
        >
          <div className="space-y-3">
            <DetailRow label="Basic Salary" value={`${profile.salaryStructure.currency} ${profile.salaryStructure.basicSalary.toLocaleString()}`} />
            <DetailRow label="Gross Salary" value={`${profile.salaryStructure.currency} ${profile.salaryStructure.grossSalary.toLocaleString()}`} />
            <DetailRow label="Net Salary" value={`${profile.salaryStructure.currency} ${profile.salaryStructure.netSalary.toLocaleString()}`} />
            <DetailRow label="Pay Frequency" value={profile.salaryStructure.payFrequency} />
            <DetailRow label="Currency" value={profile.salaryStructure.currency} />
          </div>

          {profile.salaryStructure.allowances.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Allowances</h4>
              <div className="space-y-2">
                {profile.salaryStructure.allowances.map((allowance) => (
                  <div key={allowance.id} className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <span className="text-gray-500 dark:text-gray-400">{allowance.name}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {allowance.type === 'percentage' ? `${allowance.amount}%` : `${profile.salaryStructure.currency} ${allowance.amount.toLocaleString()}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.salaryStructure.deductions.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Deductions</h4>
              <div className="space-y-2">
                {profile.salaryStructure.deductions.map((deduction) => (
                  <div key={deduction.id} className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <span className="text-gray-500 dark:text-gray-400">{deduction.name}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {deduction.type === 'percentage' ? `${deduction.amount}%` : `${profile.salaryStructure.currency} ${deduction.amount.toLocaleString()}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ProfileSection>

        <ProfileSection
          title="Documents"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H16A2.25 2.25 0 0 1 18.25 4.5v15A2.25 2.25 0 0 1 16 21.75H10.5A2.25 2.25 0 0 1 8.25 19.5v-15A2.25 2.25 0 0 1 10.5 2.25Z" />
            </svg>
          }
        >
          {profile.documents.length > 0 ? (
            <div className="space-y-3">
              {profile.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <svg className="h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H16A2.25 2.25 0 0 1 18.25 4.5v15A2.25 2.25 0 0 1 16 21.75H10.5A2.25 2.25 0 0 1 8.25 19.5v-15A2.25 2.25 0 0 1 10.5 2.25Z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{doc.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{doc.type} • {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <StatusBadge status={doc.status} variant="payroll" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No documents uploaded</p>
          )}
        </ProfileSection>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <Skeleton variant="circular" width="96px" height="96px" />
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="50%" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <Skeleton variant="circular" width="32px" height="32px" />
        <Skeleton variant="text" width="30%" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="text" width="40%" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function EditProfileForm({
  profile,
  onSave,
  onCancel,
  saving,
}: {
  profile: EmployeeProfile;
  onSave: (data: Partial<PersonalDetails> & { avatarUrl?: string }) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState<Partial<PersonalDetails> & { avatarUrl?: string }>({
    phone: profile.personalDetails.phone || '',
    address: profile.personalDetails.address || '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalDetails, string>>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const validate = () => {
    const newErrors: Partial<Record<keyof PersonalDetails, string>> = {};
    if (formData.phone && !/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const dataToSave = { ...formData };
    if (avatarFile) {
      dataToSave.avatarUrl = avatarPreview || undefined;
    }
    await onSave(dataToSave);
  };

  const handleAvatarChange = (file: File) => {
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <div className="flex items-center gap-6">
        <ProfileAvatar
          avatarUrl={avatarPreview || profile.avatarUrl}
          name={`${profile.personalDetails.firstName} ${profile.personalDetails.lastName}`}
          size="xl"
          editable
          onChange={handleAvatarChange}
        />
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Click avatar to change photo</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Max 5MB • JPG, PNG</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EditableField
          label="Phone"
          value={formData.phone || ''}
          onChange={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
          type="tel"
          error={errors.phone}
          hint="Enter your phone number"
        />
        <EditableField
          label="Address"
          value={formData.address || ''}
          onChange={(value) => setFormData((prev) => ({ ...prev, address: value }))}
          type="textarea"
          error={errors.address}
          hint="Enter your full address"
        />
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">The following fields are read-only and cannot be edited:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">First Name</p>
            <p className="font-medium text-gray-900 dark:text-white">{profile.personalDetails.firstName}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Last Name</p>
            <p className="font-medium text-gray-900 dark:text-white">{profile.personalDetails.lastName}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Email</p>
            <p className="font-medium text-gray-900 dark:text-white">{profile.personalDetails.email}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Employee ID</p>
            <p className="font-medium text-gray-900 dark:text-white">{profile.employeeId}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}