'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  FileText, 
  Lock, 
  CreditCard, 
  ShieldCheck, 
  Save, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar, 
  UploadCloud, 
  Trash2, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Loader2, 
  Key, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  X,
  FileCheck,
  Briefcase,
  Layers,
  Paperclip,
  Clock
} from 'lucide-react';
import { DayflowNavigation } from '@/components/DayflowNavigation';
import { Employee, Department, EmployeeStatus, EmploymentType, DocumentRecord, DocumentType } from '@/types/hrms';
import { PrivateInfoData, SecuritySettings } from '@/types/admin-employee';
import { SalaryInfoTab } from '@/components/admin/SalaryInfoTab';
import { formatINR } from '@/lib/admin/payroll-helpers';
import { fetchEmployeesApi } from '@/lib/apiClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminEmployeeProfilePage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  // Active Tab: 'documents' | 'private' | 'salary' | 'security'
  const [activeTab, setActiveTab] = useState<'documents' | 'private' | 'salary' | 'security'>('private');

  // Employee State
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Private Info Form State
  const [privateInfo, setPrivateInfo] = useState<PrivateInfoData>({
    dateOfBirth: '1992-04-18',
    residingAddress: '1240 Mission Street, Suite 400, San Francisco, CA 94103',
    nationality: 'American',
    personalEmail: 'sarah.jenkins.personal@gmail.com',
    gender: 'Female',
    maritalStatus: 'Single',
    bloodGroup: 'O+',
    dateOfJoining: '2022-03-15',
    bankName: 'HDFC Bank Ltd.',
    accountNumber: '50100489281923',
    ifscCode: 'HDFC0001234',
    accountType: 'Salary',
    panNumber: 'ABCDE1234F',
    uanNumber: '100987654321',
    aadhaarNumber: '•••• •••• 9821',
    emergencyContact: {
      name: 'Michael Jenkins',
      relationship: 'Brother',
      phone: '+1 (555) 987-6543',
      email: 'michael.j@gmail.com'
    }
  });

  // Header Editable Fields
  const [headerData, setHeaderData] = useState({
    name: '',
    role: '',
    department: 'Engineering' as Department,
    employmentType: 'Full-time' as EmploymentType,
    status: 'Active' as EmployeeStatus,
    managerName: '',
    email: '',
    phone: '',
    location: ''
  });

  // Security Form State
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: true,
    accountStatus: 'Active',
    lastPasswordReset: '2026-07-10',
    forcePasswordChangeOnNextLogin: false,
    temporaryPassword: ''
  });
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Document Upload Form State
  const [showDocModal, setShowDocModal] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState<DocumentType>('Identity Proof / Passport');

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load employee profile from API
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetchEmployeesApi(),
      fetch(`/api/employees/${id}`).then(r => r.json())
    ])
      .then(([emps, singleJson]) => {
        setAllEmployees(emps);
        if (singleJson.success && singleJson.data) {
          const emp = singleJson.data as Employee;
          setEmployee(emp);

          setHeaderData({
            name: emp.name,
            role: emp.role,
            department: emp.department,
            employmentType: emp.employmentType,
            status: emp.status,
            managerName: emp.managerName || 'Alex Rivera',
            email: emp.email,
            phone: emp.phone,
            location: emp.location
          });

          if (emp.personalData) {
            setPrivateInfo(prev => ({
              ...prev,
              dateOfBirth: emp.personalData?.dateOfBirth || prev.dateOfBirth,
              gender: emp.personalData?.gender || prev.gender,
              maritalStatus: emp.personalData?.maritalStatus || prev.maritalStatus,
              bloodGroup: emp.personalData?.bloodGroup || prev.bloodGroup,
              nationality: emp.personalData?.nationality || prev.nationality,
              residingAddress: emp.personalData?.residentialAddress || prev.residingAddress,
              emergencyContact: {
                name: emp.personalData?.emergencyContact?.name || prev.emergencyContact.name,
                relationship: emp.personalData?.emergencyContact?.relationship || prev.emergencyContact.relationship,
                phone: emp.personalData?.emergencyContact?.phone || prev.emergencyContact.phone,
                email: emp.personalData?.emergencyContact?.email || prev.emergencyContact.email
              }
            }));
          }

          if (emp.salaryStructure?.bankDetails) {
            setPrivateInfo(prev => ({
              ...prev,
              bankName: emp.salaryStructure?.bankDetails?.bankName || prev.bankName,
              accountNumber: emp.salaryStructure?.bankDetails?.accountNumber || prev.accountNumber,
              ifscCode: emp.salaryStructure?.bankDetails?.routingOrIfsc || prev.ifscCode
            }));
          }
        }
      })
      .catch(err => {
        console.error('Error fetching employee dossier:', err);
        showToast('Failed to load employee dossier', 'error');
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  // Master Save Handler
  const handleSaveProfile = async () => {
    if (!employee) return;
    setIsSaving(true);

    try {
      const payload: Partial<Employee> = {
        ...headerData,
        personalData: {
          dateOfBirth: privateInfo.dateOfBirth,
          gender: privateInfo.gender,
          maritalStatus: privateInfo.maritalStatus,
          bloodGroup: privateInfo.bloodGroup,
          nationality: privateInfo.nationality,
          residentialAddress: privateInfo.residingAddress,
          emergencyContact: privateInfo.emergencyContact
        },
        documents: employee.documents || []
      };

      const res = await fetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Save failed');

      setEmployee(json.data);
      showToast('Profile updates saved successfully!', 'success');
    } catch (err: any) {
      console.error('Error saving profile:', err);
      showToast(err.message || 'Error updating profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Add Document
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee || !newDocName.trim()) return;

    const newDoc: DocumentRecord = {
      id: `DOC-${Math.floor(100 + Math.random() * 900)}`,
      name: newDocName.trim(),
      type: newDocType,
      fileSize: '1.8 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Verified',
      fileUrl: '/documents/sample_document.pdf'
    };

    const updatedDocs = [...(employee.documents || []), newDoc];
    setEmployee({ ...employee, documents: updatedDocs });
    setShowDocModal(false);
    setNewDocName('');
    showToast(`Document "${newDoc.name}" uploaded to employee vault.`, 'success');
  };

  // Delete Document
  const handleDeleteDocument = (docId: string) => {
    if (!employee) return;
    const updatedDocs = (employee.documents || []).filter(d => d.id !== docId);
    setEmployee({ ...employee, documents: updatedDocs });
    showToast('Document removed from employee vault.', 'success');
  };

  // Password Override Handler
  const handlePasswordOverride = () => {
    if (!newAdminPassword.trim()) {
      showToast('Please enter a valid temporary password.', 'error');
      return;
    }
    setSecuritySettings({
      ...securitySettings,
      lastPasswordReset: new Date().toISOString().split('T')[0],
      temporaryPassword: newAdminPassword
    });
    setNewAdminPassword('');
    showToast('Admin password override applied. Temporary credentials provisioned.', 'success');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <DayflowNavigation
          employees={allEmployees}
          selectedEmployee={null}
          onSelectEmployee={() => {}}
        />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3 shadow-md animate-pulse">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-700">Loading 360° Employee Dossier...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <DayflowNavigation
          employees={allEmployees}
          selectedEmployee={null}
          onSelectEmployee={() => {}}
        />
        <div className="flex-1 max-w-xl mx-auto p-12 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Employee Not Found</h2>
          <p className="text-xs text-slate-500">Record with ID {id} does not exist in the database.</p>
          <Link
            href="/admin/employees"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Employee Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-slate-800 flex flex-col">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2 ${
            toastMessage.type === 'success' ? 'bg-emerald-950 text-emerald-100 border-emerald-800' : 'bg-rose-950 text-rose-100 border-rose-800'
          }`}>
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Header Navigation */}
      <DayflowNavigation
        employees={allEmployees}
        selectedEmployee={employee}
        onSelectEmployee={(emp) => {
          if (emp && emp.id !== employee.id) {
            router.push(`/admin/profile/${emp.id}`);
          }
        }}
      />

      {/* Main Dossier Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1">
        
        {/* Breadcrumbs, Cross-Module Shortcuts & Master Save Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-3 flex-wrap text-xs">
            <Link
              href="/admin/employees"
              className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Directory
            </Link>
            
            <span className="text-slate-300">/</span>

            <Link
              href="/"
              className="font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Dashboard
            </Link>

            <span className="text-slate-300">•</span>

            {/* Quick Cross-Module Links for this Employee */}
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/attendance?employeeId=${employee.id}`}
                className="px-2.5 py-1 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-600 transition-colors inline-flex items-center gap-1"
              >
                <Clock className="w-3 h-3 text-slate-400" /> Attendance Logs
              </Link>
              <Link
                href={`/admin/leaves?employeeId=${employee.id}`}
                className="px-2.5 py-1 bg-slate-50 hover:bg-amber-50 hover:text-amber-800 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-600 transition-colors inline-flex items-center gap-1"
              >
                <Calendar className="w-3 h-3 text-slate-400" /> Time Off
              </Link>
              <Link
                href={`/admin/payroll?search=${employee.id}`}
                className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-600 transition-colors inline-flex items-center gap-1"
              >
                <CreditCard className="w-3 h-3 text-slate-400" /> Payroll Ledger
              </Link>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer shrink-0"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save All Changes
          </button>
        </div>

        {/* ========================================================================= */}
        {/* HEADER PROFILE HERO CARD                                                  */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Avatar & Core Profile Controls */}
            <div className="flex items-start gap-5">
              <div className="relative shrink-0">
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-20 h-20 rounded-3xl object-cover ring-4 ring-slate-100 shadow-md"
                />
                <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ring-2 ring-white ${
                  headerData.status === 'Active' ? 'bg-emerald-500' :
                  headerData.status === 'Remote' ? 'bg-sky-500' :
                  headerData.status === 'On Leave' ? 'bg-purple-500' : 'bg-amber-500'
                }`} />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <input
                    type="text"
                    value={headerData.name}
                    onChange={(e) => setHeaderData({ ...headerData, name: e.target.value })}
                    className="text-xl font-black text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none px-1"
                  />
                  <span className="font-mono text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    {employee.id}
                  </span>
                  <span className="text-[10px] uppercase font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                    Admin Full Access
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-wrap text-xs">
                  <input
                    type="text"
                    value={headerData.role}
                    onChange={(e) => setHeaderData({ ...headerData, role: e.target.value })}
                    className="font-bold text-indigo-600 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none px-1"
                    placeholder="Role Title"
                  />
                  <span className="text-slate-300">•</span>
                  <select
                    value={headerData.department}
                    onChange={(e) => setHeaderData({ ...headerData, department: e.target.value as Department })}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="People Operations">People Operations</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Customer Success">Customer Success</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Status & Employment Type Selectors */}
            <div className="flex items-center gap-3 flex-wrap">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Status</label>
                <select
                  value={headerData.status}
                  onChange={(e) => setHeaderData({ ...headerData, status: e.target.value as EmployeeStatus })}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800"
                >
                  <option value="Active">Active / Present</option>
                  <option value="Remote">Remote</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Probation">Probation</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Employment Type</label>
                <select
                  value={headerData.employmentType}
                  onChange={(e) => setHeaderData({ ...headerData, employmentType: e.target.value as EmploymentType })}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-800"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>
            </div>

          </div>

          {/* Quick Contact & Line Manager Metadata Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <Mail className="w-3 h-3 text-indigo-600" /> Work Email
              </span>
              <input
                type="email"
                value={headerData.email}
                onChange={(e) => setHeaderData({ ...headerData, email: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-medium"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <Phone className="w-3 h-3 text-indigo-600" /> Mobile Phone
              </span>
              <input
                type="text"
                value={headerData.phone}
                onChange={(e) => setHeaderData({ ...headerData, phone: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-medium"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-indigo-600" /> Work Location
              </span>
              <input
                type="text"
                value={headerData.location}
                onChange={(e) => setHeaderData({ ...headerData, location: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-medium"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <Building className="w-3 h-3 text-indigo-600" /> Reporting Manager
              </span>
              <input
                type="text"
                value={headerData.managerName}
                onChange={(e) => setHeaderData({ ...headerData, managerName: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-medium"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4 DOSSIER TABS NAVIGATION                                                 */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('private')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'private'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Tab 2: Private Info</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'documents'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Tab 1: Resume / Documents ({employee.documents?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('salary')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'salary'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Tab 3: Salary Info (Admin Only)</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Tab 4: Security</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: RESUME / DOCUMENTS VAULT                                           */}
        {/* ========================================================================= */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Verification Documents & Vault</h3>
                <p className="text-xs text-slate-500">
                  Government IDs, contracts, offer letters, and credentials.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDocModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" /> Upload Document
              </button>
            </div>

            {/* Document Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(employee.documents || []).length === 0 ? (
                <div className="col-span-3 p-12 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <FileCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">No documents in vault</p>
                  <p className="text-xs text-slate-400 mt-0.5">Upload verified identification or offer letters.</p>
                </div>
              ) : (
                (employee.documents || []).map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{doc.name}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold">{doc.type}</span>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {doc.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                      <span>{doc.fileSize} • Uploaded {doc.uploadDate}</span>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => alert(`Downloading verified copy of ${doc.name}`)}
                          className="p-1.5 text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                          title="Download Document"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                          title="Delete Document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PRIVATE INFO (FULL READ/WRITE ACCESS)                              */}
        {/* ========================================================================= */}
        {activeTab === 'private' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Private & Statutory Information</h3>
              <p className="text-xs text-slate-500">
                Full read/write permissions to personal data, tax identification, and direct deposit routing.
              </p>
            </div>

            {/* Section 1: Personal Demographics */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                1. Personal Demographics
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date of Birth (DOB) *</label>
                  <input
                    type="date"
                    value={privateInfo.dateOfBirth}
                    onChange={(e) => setPrivateInfo({ ...privateInfo, dateOfBirth: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={privateInfo.gender}
                    onChange={(e) => setPrivateInfo({ ...privateInfo, gender: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Marital Status</label>
                  <select
                    value={privateInfo.maritalStatus}
                    onChange={(e) => setPrivateInfo({ ...privateInfo, maritalStatus: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nationality</label>
                  <input
                    type="text"
                    value={privateInfo.nationality}
                    onChange={(e) => setPrivateInfo({ ...privateInfo, nationality: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
                  <input
                    type="text"
                    value={privateInfo.bloodGroup}
                    onChange={(e) => setPrivateInfo({ ...privateInfo, bloodGroup: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Personal Email Address</label>
                  <input
                    type="email"
                    value={privateInfo.personalEmail}
                    onChange={(e) => setPrivateInfo({ ...privateInfo, personalEmail: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 text-xs">Residing Residential Address</label>
                <textarea
                  rows={2}
                  value={privateInfo.residingAddress}
                  onChange={(e) => setPrivateInfo({ ...privateInfo, residingAddress: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white text-xs"
                />
              </div>
            </div>

            {/* Section 2: Statutory Tax IDs & Compliance */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                2. Statutory Tax Identifiers & Compliance
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">PAN Card Number</label>
                  <input
                    type="text"
                    value={privateInfo.panNumber}
                    onChange={(e) => setPrivateInfo({ ...privateInfo, panNumber: e.target.value.toUpperCase() })}
                    placeholder="ABCDE1234F"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">UAN / Provident Fund Number</label>
                  <input
                    type="text"
                    value={privateInfo.uanNumber}
                    onChange={(e) => setPrivateInfo({ ...privateInfo, uanNumber: e.target.value })}
                    placeholder="100987654321"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Aadhaar / National ID</label>
                  <input
                    type="text"
                    value={privateInfo.aadhaarNumber || '•••• •••• 9821'}
                    onChange={(e) => setPrivateInfo({ ...privateInfo, aadhaarNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Bank Details */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                3. Direct Deposit Bank Credentials
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={privateInfo.bankName}
                    onChange={(e) => setPrivateInfo({ ...privateInfo, bankName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Account Number</label>
                  <input
                    type="text"
                    value={privateInfo.accountNumber}
                    onChange={(e) => setPrivateInfo({ ...privateInfo, accountNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">IFSC / Routing Code</label>
                  <input
                    type="text"
                    value={privateInfo.ifscCode}
                    onChange={(e) => setPrivateInfo({ ...privateInfo, ifscCode: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Account Type</label>
                  <select
                    value={privateInfo.accountType}
                    onChange={(e) => setPrivateInfo({ ...privateInfo, accountType: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Salary">Salary Account</option>
                    <option value="Savings">Savings Account</option>
                    <option value="Current">Current Account</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Emergency Contact */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                4. Primary Emergency Contact
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={privateInfo.emergencyContact.name}
                    onChange={(e) => setPrivateInfo({
                      ...privateInfo,
                      emergencyContact: { ...privateInfo.emergencyContact, name: e.target.value }
                    })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Relationship</label>
                  <input
                    type="text"
                    value={privateInfo.emergencyContact.relationship}
                    onChange={(e) => setPrivateInfo({
                      ...privateInfo,
                      emergencyContact: { ...privateInfo.emergencyContact, relationship: e.target.value }
                    })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Emergency Phone Number</label>
                  <input
                    type="text"
                    value={privateInfo.emergencyContact.phone}
                    onChange={(e) => setPrivateInfo({
                      ...privateInfo,
                      emergencyContact: { ...privateInfo.emergencyContact, phone: e.target.value }
                    })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SALARY INFO (ADMIN ONLY)                                           */}
        {/* ========================================================================= */}
        {activeTab === 'salary' && (
          <SalaryInfoTab
            employeeId={employee.id}
            employeeName={employee.name}
            onSaveSuccess={(updatedConfig) => {
              showToast('Salary structure updated successfully!', 'success');
            }}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SECURITY & ACCESS OVERRIDE                                         */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Security & Authentication Overrides</h3>
              <p className="text-xs text-slate-500">
                Administrative password reset, account status enforcement, and multi-factor authentication controls.
              </p>
            </div>

            {/* Admin Password Reset Override */}
            <div className="p-5 bg-gradient-to-br from-indigo-50/60 to-white rounded-2xl border border-indigo-100 space-y-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  Admin Password Reset Override
                </h4>
              </div>
              <p className="text-xs text-slate-600">
                Directly provision a new temporary password for this employee without email confirmation.
              </p>

              <div className="flex items-center gap-3 max-w-md">
                <div className="relative flex-1">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="Enter new temporary password..."
                    className="w-full text-xs p-2.5 pr-9 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handlePasswordOverride}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Apply Override
                </button>
              </div>

              {securitySettings.temporaryPassword && (
                <div className="p-2.5 bg-indigo-100/70 rounded-xl text-xs text-indigo-900 font-mono">
                  Active Temporary Password: <strong>{securitySettings.temporaryPassword}</strong>
                </div>
              )}
            </div>

            {/* Security Toggles */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <div className="text-xs font-bold text-slate-900">Two-Factor Authentication (2FA)</div>
                  <div className="text-[11px] text-slate-500">Require OTP authenticator during staff sign-in</div>
                </div>
                <input
                  type="checkbox"
                  checked={securitySettings.twoFactorEnabled}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorEnabled: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <div className="text-xs font-bold text-slate-900">Force Password Change on Next Login</div>
                  <div className="text-[11px] text-slate-500">Prompt employee to create personal password upon entering</div>
                </div>
                <input
                  type="checkbox"
                  checked={securitySettings.forcePasswordChangeOnNextLogin}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, forcePasswordChangeOnNextLogin: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Danger Zone: Terminate Active Sessions */}
            <div className="p-5 bg-rose-50/50 rounded-2xl border border-rose-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" /> Invalidate Active Sessions
                </div>
                <div className="text-[11px] text-rose-700 mt-0.5">
                  Immediately sign out this employee across all active browser and mobile devices.
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast('All active session tokens invalidated.', 'success')}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Sign Out Everywhere
              </button>
            </div>

          </div>
        )}

      </main>

      {/* Document Upload Modal */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-bold">Upload Employee Document</h4>
              </div>
              <button onClick={() => setShowDocModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Name *</label>
                <input
                  type="text"
                  required
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. Passport_Copy_2026.pdf"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Category</label>
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value as DocumentType)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="Identity Proof / Passport">Identity Proof / Passport</option>
                  <option value="Offer Letter">Offer Letter</option>
                  <option value="Employment Contract">Employment Contract</option>
                  <option value="Tax Document (W-4 / Form 16)">Tax Document (W-4 / Form 16)</option>
                  <option value="Educational Degree">Educational Degree</option>
                  <option value="Background Verification">Background Verification</option>
                </select>
              </div>

              <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-1 bg-slate-50">
                <Paperclip className="w-6 h-6 text-slate-400 mx-auto" />
                <div className="text-xs font-semibold text-slate-700">Attach PDF, PNG, or JPG</div>
                <div className="text-[10px] text-slate-400">Encrypted compliance storage</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Upload & Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

