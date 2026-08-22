'use client';

import React, { useState } from 'react';
import { Employee, PersonalDetails, JobDetails, SalaryStructure, EmployeeDocument } from '../types/hrms';
import { AvatarUpload } from './AvatarUpload';
import { 
  Lock, 
  Pencil, 
  Check, 
  X, 
  ShieldCheck, 
  Building2, 
  Briefcase, 
  CreditCard, 
  FileText, 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  Calendar, 
  AlertCircle, 
  Download, 
  Eye, 
  UploadCloud, 
  Sparkles,
  Info,
  DollarSign,
  HeartHandshake
} from 'lucide-react';

interface EmployeeProfileViewProps {
  employee: Employee;
  onUpdateProfile?: (updated: Employee) => void;
  onClose?: () => void;
  showBackButton?: boolean;
}

export type ProfileTab = 'personal' | 'job' | 'salary' | 'documents';

export const EmployeeProfileView: React.FC<EmployeeProfileViewProps> = ({
  employee,
  onUpdateProfile,
  onClose,
  showBackButton = false
}) => {
  // State for Edit Mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');

  // Form state for restricted editable fields (Address, Phone, Avatar)
  const [editablePhone, setEditablePhone] = useState(employee.phone || '');
  const [editableAddress, setEditableAddress] = useState(
    employee.address || employee.location || '742 Evergreen Terrace, San Francisco, CA'
  );
  const [editableAvatar, setEditableAvatar] = useState(employee.avatar);

  // Document upload simulation
  const [documentsList, setDocumentsList] = useState<EmployeeDocument[]>(employee.documents || []);

  const handleAvatarChange = (newUrl: string) => {
    setEditableAvatar(newUrl);
  };

  const handleSaveChanges = () => {
    const updatedEmployee: Employee = {
      ...employee,
      phone: editablePhone,
      address: editableAddress,
      avatar: editableAvatar
    };

    if (onUpdateProfile) {
      onUpdateProfile(updatedEmployee);
    }
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    setEditablePhone(employee.phone || '');
    setEditableAddress(employee.address || employee.location || '');
    setEditableAvatar(employee.avatar);
    setIsEditMode(false);
  };

  // Safe defaults for personal details
  const personal: PersonalDetails = employee.personalDetails || {
    dob: '1992-06-14',
    gender: 'Female',
    nationality: 'United States',
    maritalStatus: 'Married',
    bloodGroup: 'O+ Positive',
    emergencyContact: {
      name: 'Mark Jenkins',
      relationship: 'Spouse',
      phone: '+1 (555) 887-3321'
    }
  };

  // Safe defaults for job details
  const job: JobDetails = employee.jobDetails || {
    employeeId: employee.id,
    designation: employee.role,
    department: employee.department,
    reportingManager: employee.managerName || 'Alex Rivera (VP Eng)',
    employmentType: 'Full-Time Regular',
    workLocation: employee.location,
    joiningDate: employee.joinDate,
    probationStatus: 'Confirmed',
    workEmail: employee.email,
    slackHandle: `@${employee.name.toLowerCase().replace(' ', '.')}`
  };

  // Safe defaults for salary structure
  const salary: SalaryStructure = employee.salaryStructure || {
    annualCtc: employee.salary,
    currency: 'USD ($)',
    basicSalary: '$6,041.67 / mo',
    hra: '$2,416.67 / mo',
    specialAllowance: '$2,416.66 / mo',
    performanceBonus: '$12,000 / year (Quarterly)',
    pfDeductions: '$725.00 / mo',
    taxDeductions: '$1,850.00 / mo',
    netMonthlyPay: '$8,299.00 / mo',
    bankName: 'Silicon Valley National Bank',
    accountNumberMasked: '•••• •••• •••• 8492',
    ifscCode: 'SVNBUS66X',
    paymentFrequency: 'Monthly'
  };

  return (
    <div className="space-y-6">
      
      {/* ========================================================================= */}
      {/* HERO BANNER & PROFILE CARD                                                */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-sm">
        
        {/* Cover Gradient Background */}
        <div className="h-36 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 relative">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {showBackButton && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Profile Details Header */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row items-start md:items-end justify-between gap-4 -mt-16">
          
          {/* Avatar + Main Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <AvatarUpload
              avatarUrl={editableAvatar}
              name={employee.name}
              isEditable={isEditMode}
              status={employee.status}
              onAvatarChange={handleAvatarChange}
              size="xl"
            />

            <div className="space-y-1 sm:pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {employee.name}
                </h1>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                  {employee.id}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  employee.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                  employee.status === 'Remote' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                  'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {employee.status}
                </span>
              </div>

              <p className="text-sm font-semibold text-indigo-700">
                {employee.role} • <strong className="text-slate-700">{employee.department}</strong>
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {employee.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {employee.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Joined {employee.joinDate}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Toggle Edit / Save Mode */}
          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end pb-2">
            {!isEditMode ? (
              <button
                onClick={() => setIsEditMode(true)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit Contact Info
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Check className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Edit Mode Notice Banner */}
        {isEditMode && (
          <div className="mx-6 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Restricted Edit Mode Active:</strong> You can modify your <strong>Address</strong>, <strong>Phone</strong>, and <strong>Profile Picture</strong>. Official Job Details, Salary, and Company records are locked by HR Administration.
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
              Restricted Form
            </span>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* NAVIGATION TABS FOR SECTIONS                                              */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'personal'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" /> Personal Details
        </button>

        <button
          onClick={() => setActiveTab('job')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'job'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Job Details
          <Lock className="w-3 h-3 text-slate-400" />
        </button>

        <button
          onClick={() => setActiveTab('salary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'salary'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" /> Salary Structure
          <Lock className="w-3 h-3 text-slate-400" />
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'documents'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" /> Documents & Contracts ({documentsList.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB CONTENT 1: PERSONAL DETAILS                                          */}
      {/* ========================================================================= */}
      {activeTab === 'personal' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Personal & Contact Information</h3>
              <p className="text-xs text-slate-500">Identity, demographics, and primary contact records</p>
            </div>

            {/* Visual Cue Legend */}
            <div className="flex items-center gap-3 text-[11px] font-semibold bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <span className="flex items-center gap-1 text-emerald-700">
                <Pencil className="w-3 h-3 text-emerald-600" /> Editable Fields
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1 text-slate-500">
                <Lock className="w-3 h-3 text-slate-400" /> Locked by HR
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Field: Full Name (Locked) */}
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Legal Full Name</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              </div>
              <input
                type="text"
                disabled
                value={employee.name}
                className="w-full text-xs font-bold text-slate-800 bg-transparent border-0 p-0 cursor-not-allowed focus:outline-none"
              />
            </div>

            {/* Field: Official Email (Locked) */}
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Company Email</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              </div>
              <input
                type="text"
                disabled
                value={employee.email}
                className="w-full text-xs font-bold text-slate-800 bg-transparent border-0 p-0 cursor-not-allowed focus:outline-none"
              />
            </div>

            {/* Field: Phone Number (EDITABLE) */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              isEditMode 
                ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm' 
                : 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300'
            }`}>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold text-slate-700">Primary Phone Number</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  <Pencil className="w-3 h-3 text-emerald-600" /> Editable
                </span>
              </div>
              <input
                type="text"
                disabled={!isEditMode}
                value={editablePhone}
                onChange={(e) => setEditablePhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className={`w-full text-xs font-bold text-slate-900 bg-transparent border-0 p-0 focus:outline-none ${
                  isEditMode ? 'cursor-text text-indigo-950' : 'cursor-default'
                }`}
              />
            </div>

            {/* Field: Date of Birth (Locked) */}
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Date of Birth</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              </div>
              <div className="text-xs font-bold text-slate-800">{personal.dob}</div>
            </div>

            {/* Field: Residential Address (EDITABLE) - Spans 2 columns */}
            <div className={`p-3.5 rounded-2xl border col-span-1 md:col-span-2 transition-all ${
              isEditMode 
                ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm' 
                : 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300'
            }`}>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold text-slate-700">Current Residential Address</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  <Pencil className="w-3 h-3 text-emerald-600" /> Editable
                </span>
              </div>
              <textarea
                rows={2}
                disabled={!isEditMode}
                value={editableAddress}
                onChange={(e) => setEditableAddress(e.target.value)}
                placeholder="Enter complete residential address, city, state, zip..."
                className={`w-full text-xs font-bold text-slate-900 bg-transparent border-0 p-0 resize-none focus:outline-none ${
                  isEditMode ? 'cursor-text text-indigo-950' : 'cursor-default'
                }`}
              />
            </div>

            {/* Field: Gender (Locked) */}
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Gender</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              </div>
              <div className="text-xs font-bold text-slate-800">{personal.gender}</div>
            </div>

            {/* Field: Nationality (Locked) */}
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Nationality</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              </div>
              <div className="text-xs font-bold text-slate-800">{personal.nationality}</div>
            </div>

            {/* Field: Blood Group (Locked) */}
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Blood Group</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              </div>
              <div className="text-xs font-bold text-slate-800">{personal.bloodGroup}</div>
            </div>

            {/* Field: Emergency Contact (Locked) */}
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Emergency Contact</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              </div>
              <div className="text-xs font-bold text-slate-800">
                {personal.emergencyContact.name} ({personal.emergencyContact.relationship}) • {personal.emergencyContact.phone}
              </div>
            </div>

          </div>

          {/* Quick Edit Action Bar if in Edit Mode */}
          {isEditMode && (
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" /> Save Profile Details
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 2: JOB DETAILS (ALL LOCKED BY HR)                            */}
      {/* ========================================================================= */}
      {activeTab === 'job' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">Employment & Organizational Records</h3>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" /> HR Controlled
                </span>
              </div>
              <p className="text-xs text-slate-500">Designation, department, reporting chain, and corporate contracts</p>
            </div>

            <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> Official Dayflow Records
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Employee Identification</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-sm font-mono font-bold text-slate-900">{job.employeeId}</div>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Designation / Role</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-sm font-bold text-slate-900">{job.designation}</div>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Department</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-sm font-bold text-indigo-700">{job.department}</div>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Direct Reporting Manager</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-sm font-bold text-slate-900">{job.reportingManager}</div>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Employment Type</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-sm font-bold text-slate-900">{job.employmentType}</div>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Probation / Confirmation Status</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> {job.probationStatus}
              </div>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 col-span-1 md:col-span-2">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Assigned Work Location / Base</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-sm font-bold text-slate-900">{job.workLocation}</div>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Official Start Date</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-sm font-bold text-slate-900">{job.joiningDate}</div>
            </div>

          </div>

          {/* Skills & Competencies */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Verified Technical Competencies & Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 3: SALARY STRUCTURE (ALL LOCKED BY HR)                       */}
      {/* ========================================================================= */}
      {activeTab === 'salary' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">Compensation & Payroll Structure</h3>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-700" /> Confidential & Locked
                </span>
              </div>
              <p className="text-xs text-slate-500">Gross pay breakdown, provident fund, tax withholdings, and bank disbursement details</p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Annual CTC Package</span>
              <span className="text-lg font-black text-slate-900 font-mono">{salary.annualCtc}</span>
            </div>
          </div>

          {/* Salary Breakdown Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Monthly Take-Home */}
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200">
              <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1">
                <span>Net Monthly Take-Home</span>
                <Lock className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <div className="text-xl font-extrabold text-emerald-950 font-mono">{salary.netMonthlyPay}</div>
              <span className="text-[10px] text-emerald-700 mt-1 block">Credited on 1st of every month</span>
            </div>

            {/* Basic Pay */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Basic Salary (Fixed)</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-lg font-bold text-slate-900 font-mono">{salary.basicSalary}</div>
              <span className="text-[10px] text-slate-400 mt-1 block">50% of monthly gross</span>
            </div>

            {/* HRA Allowance */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>House Rent Allowance (HRA)</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-lg font-bold text-slate-900 font-mono">{salary.hra}</div>
              <span className="text-[10px] text-slate-400 mt-1 block">Tax exempt against rent receipts</span>
            </div>

            {/* Special Allowance */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Special / Flexible Allowance</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-lg font-bold text-slate-900 font-mono">{salary.specialAllowance}</div>
            </div>

            {/* PF Deductions */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Provident Fund (PF) Deduction</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-lg font-bold text-rose-700 font-mono">- {salary.pfDeductions}</div>
              <span className="text-[10px] text-slate-400 mt-1 block">Matched 100% by Dayflow</span>
            </div>

            {/* Tax Deductions */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Income Tax / TDS Withheld</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-lg font-bold text-rose-700 font-mono">- {salary.taxDeductions}</div>
              <span className="text-[10px] text-slate-400 mt-1 block">Form 16 issued annually</span>
            </div>

          </div>

          {/* Bank & Disbursement Info */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Disbursement Bank Account Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Bank Entity:</span>
                <span className="font-bold text-slate-900">{salary.bankName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Account Number:</span>
                <span className="font-mono font-bold text-slate-900">{salary.accountNumberMasked}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Routing / IFSC Code:</span>
                <span className="font-mono font-bold text-slate-900">{salary.ifscCode}</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 4: DOCUMENTS & ATTACHMENTS                                   */}
      {/* ========================================================================= */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Verified Personnel Documents</h3>
              <p className="text-xs text-slate-500">Official employment agreements, identity proofs, and tax forms</p>
            </div>

            <button
              onClick={() => {
                const newDoc: EmployeeDocument = {
                  id: `DOC-${Date.now()}`,
                  title: 'Additional Certificate / Proof',
                  category: 'Certificates',
                  fileName: 'Uploaded_Certificate_2026.pdf',
                  fileSize: '1.4 MB',
                  uploadDate: new Date().toISOString().split('T')[0],
                  status: 'Pending Review'
                };
                setDocumentsList(prev => [newDoc, ...prev]);
              }}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" /> Upload Document
            </button>
          </div>

          <div className="space-y-3">
            {documentsList.map((doc) => (
              <div
                key={doc.id}
                className="p-4 bg-slate-50/80 hover:bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white text-indigo-600 border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{doc.title}</h4>
                      <span className={`text-[9px] font-bold px-2 py-0.2 rounded-full ${
                        doc.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {doc.fileName} • <strong className="text-slate-600">{doc.fileSize}</strong> • Uploaded {doc.uploadDate}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => window.open('#', '_blank')}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                    title="View preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => alert(`Downloading ${doc.fileName}...`)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-600 hover:text-indigo-800 border border-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Dropzone Placeholder */}
          <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center hover:border-indigo-400 hover:bg-indigo-50/20 transition-all cursor-pointer">
            <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-900">Drag and drop new employee documents here</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Supported formats: PDF, PNG, JPG, DOCX (Max 15MB)</p>
          </div>
        </div>
      )}

    </div>
  );
};

