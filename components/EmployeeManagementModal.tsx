'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Briefcase, 
  FileText, 
  DollarSign, 
  Edit3, 
  Save, 
  Trash2, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  FileCheck, 
  Building, 
  CreditCard,
  Eye,
  Download,
  AlertTriangle
} from 'lucide-react';
import { 
  Employee, 
  Department, 
  EmployeeStatus, 
  EmploymentType, 
  DocumentRecord, 
  DocumentType, 
  PersonalData, 
  SalaryStructure 
} from '../types/hrms';

interface EmployeeManagementModalProps {
  employee: Employee | null;
  isOpen: boolean;
  isNewEmployee?: boolean;
  initialEditMode?: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => void;
  onDelete?: (employeeId: string) => void;
}

type ActiveTab = 'personal' | 'job' | 'documents' | 'salary';

export const EmployeeManagementModal: React.FC<EmployeeManagementModalProps> = ({
  employee,
  isOpen,
  isNewEmployee = false,
  initialEditMode = false,
  onClose,
  onSave,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('personal');
  const [isEditing, setIsEditing] = useState(initialEditMode || isNewEmployee);

  // Form State
  const [formData, setFormData] = useState<Partial<Employee>>({});
  const [skillsInput, setSkillsInput] = useState('');
  
  // Document Upload Form State
  const [newDocType, setNewDocType] = useState<DocumentType>('Offer Letter');
  const [newDocName, setNewDocName] = useState('');
  const [showDocUpload, setShowDocUpload] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (employee) {
      setFormData(JSON.parse(JSON.stringify(employee)));
      setIsEditing(initialEditMode || isNewEmployee);
    } else if (isNewEmployee) {
      // Default template for new employee
      const defaultNewEmp: Employee = {
        id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        name: '',
        email: '',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: '',
        department: 'Engineering',
        employmentType: 'Full-time',
        status: 'Active',
        joinDate: new Date().toISOString().split('T')[0],
        salary: '$120,000',
        phone: '+1 (555) 000-0000',
        location: 'San Francisco, CA (HQ)',
        leaveBalance: {
          casual: { total: 12, used: 0 },
          sick: { total: 10, used: 0 },
          paid: { total: 20, used: 0 },
          emergency: { total: 5, used: 0 }
        },
        attendanceToday: {
          status: 'Absent'
        },
        directReportsCount: 0,
        managerName: 'Alex Rivera',
        skills: ['TypeScript', 'React'],
        personalData: {
          dateOfBirth: '1995-01-01',
          gender: 'Prefer not to say',
          maritalStatus: 'Single',
          bloodGroup: 'O+',
          nationality: 'United States',
          residentialAddress: '',
          emergencyContact: {
            name: '',
            relationship: 'Family',
            phone: ''
          }
        },
        salaryStructure: {
          annualBaseSalary: 120000,
          currency: '$',
          payFrequency: 'Monthly',
          breakdown: {
            basicPay: 5000,
            hra: 2500,
            specialAllowance: 1500,
            performanceBonus: 1000,
            providentFundOr401k: 600,
            taxDeduction: 1500,
            healthInsuranceDeduction: 300,
            netMonthlySalary: 7600
          },
          bankDetails: {
            bankName: 'Chase Bank',
            accountNumber: '•••••••• 1234',
            routingOrIfsc: '021000021',
            accountType: 'Checking'
          }
        },
        documents: []
      };
      setFormData(defaultNewEmp);
      setIsEditing(true);
    }
  }, [employee, isNewEmployee, initialEditMode, isOpen]);

  if (!isOpen) return null;

  // Handle salary calculation dynamically when base salary changes
  const handleAnnualSalaryChange = (val: number) => {
    const monthlyGross = Math.round(val / 12);
    const basicPay = Math.round(monthlyGross * 0.50);
    const hra = Math.round(monthlyGross * 0.25);
    const specialAllowance = Math.round(monthlyGross * 0.15);
    const performanceBonus = Math.round(monthlyGross * 0.10);
    const providentFundOr401k = Math.round(monthlyGross * 0.05);
    const taxDeduction = Math.round(monthlyGross * 0.15);
    const healthInsuranceDeduction = 320;
    const netMonthlySalary = monthlyGross - providentFundOr401k - taxDeduction - healthInsuranceDeduction;

    setFormData((prev) => ({
      ...prev,
      salary: `$${val.toLocaleString()}`,
      salaryStructure: {
        ...prev.salaryStructure!,
        annualBaseSalary: val,
        breakdown: {
          basicPay,
          hra,
          specialAllowance,
          performanceBonus,
          providentFundOr401k,
          taxDeduction,
          healthInsuranceDeduction,
          netMonthlySalary
        }
      }
    }));
  };

  // Add skill tag
  const handleAddSkill = () => {
    if (!skillsInput.trim()) return;
    const currentSkills = formData.skills || [];
    if (!currentSkills.includes(skillsInput.trim())) {
      setFormData({
        ...formData,
        skills: [...currentSkills, skillsInput.trim()]
      });
    }
    setSkillsInput('');
  };

  // Remove skill tag
  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: (formData.skills || []).filter(s => s !== skillToRemove)
    });
  };

  // Add document
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const newDoc: DocumentRecord = {
      id: `DOC-${Math.floor(100 + Math.random() * 900)}`,
      name: newDocName.trim().endsWith('.pdf') ? newDocName.trim() : `${newDocName.trim()}.pdf`,
      type: newDocType,
      fileSize: '1.5 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Pending Review'
    };

    setFormData({
      ...formData,
      documents: [newDoc, ...(formData.documents || [])]
    });

    setNewDocName('');
    setShowDocUpload(false);
  };

  // Save handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.email?.trim()) {
      alert('Please fill in employee Name and Work Email.');
      return;
    }
    onSave(formData as Employee);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header Banner */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/40">
              {isNewEmployee ? <Plus className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  {isNewEmployee ? 'Add New Employee Record' : (formData.name || 'Employee Dossier')}
                </h3>
                {formData.id && (
                  <span className="text-[11px] font-mono bg-white/10 text-indigo-300 px-2 py-0.5 rounded-md font-semibold">
                    {formData.id}
                  </span>
                )}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  formData.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  formData.status === 'Remote' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                  formData.status === 'On Leave' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                }`}>
                  {formData.status || 'Active'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isEditing ? 'Editing employee record & administration details' : 'Complete 360° employee dossier, job info & compensation'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!isNewEmployee && (
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isEditing 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                {isEditing ? 'View Mode' : 'Edit Record'}
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-200 bg-slate-50/80 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setActiveTab('personal')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'personal'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Personal Data
          </button>

          <button
            onClick={() => setActiveTab('job')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'job'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" /> Job & Organization
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'documents'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Documents Vault
            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-bold">
              {formData.documents?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('salary')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'salary'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" /> Salary & Compensation
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleFormSubmit} className="overflow-y-auto p-6 flex-1 space-y-6">
          
          {/* ========================================================================= */}
          {/* TAB 1: PERSONAL DATA                                                      */}
          {/* ========================================================================= */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              
              {/* Profile Avatar & Basic Identity */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <img
                  src={formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={formData.name || 'Avatar'}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white shrink-0"
                />
                <div className="flex-1 w-full space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Full Legal Name *</label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-700 font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Avatar Image URL</label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={formData.avatar || ''}
                        onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                        placeholder="https://..."
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 disabled:text-slate-600 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" /> Contact & Residence
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">Work Email Address *</label>
                    <input
                      type="email"
                      disabled={!isEditing}
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="employee@dayflow.io"
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">Primary Phone Number *</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">Residential Address</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.personalData?.residentialAddress || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalData: { ...formData.personalData!, residentialAddress: e.target.value }
                      })}
                      placeholder="Street Address, City, State, ZIP Code"
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50"
                    />
                  </div>
                </div>
              </div>

              {/* Demographics */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" /> Demographics & Identity
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      disabled={!isEditing}
                      value={formData.personalData?.dateOfBirth || '1995-01-01'}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalData: { ...formData.personalData!, dateOfBirth: e.target.value }
                      })}
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">Gender</label>
                    <select
                      disabled={!isEditing}
                      value={formData.personalData?.gender || 'Female'}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalData: { ...formData.personalData!, gender: e.target.value as any }
                      })}
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">Blood Group</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.personalData?.bloodGroup || 'O+'}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalData: { ...formData.personalData!, bloodGroup: e.target.value }
                      })}
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">Marital Status</label>
                    <select
                      disabled={!isEditing}
                      value={formData.personalData?.maritalStatus || 'Single'}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalData: { ...formData.personalData!, maritalStatus: e.target.value as any }
                      })}
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50"
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-3 p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-rose-600" /> Emergency Contact
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-700 block mb-1">Contact Name</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.personalData?.emergencyContact?.name || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalData: {
                          ...formData.personalData!,
                          emergencyContact: { ...formData.personalData!.emergencyContact, name: e.target.value }
                        }
                      })}
                      placeholder="e.g. Michael Jenkins"
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-700 block mb-1">Relationship</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.personalData?.emergencyContact?.relationship || 'Spouse'}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalData: {
                          ...formData.personalData!,
                          emergencyContact: { ...formData.personalData!.emergencyContact, relationship: e.target.value }
                        }
                      })}
                      placeholder="e.g. Spouse / Parent"
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-700 block mb-1">Emergency Phone</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.personalData?.emergencyContact?.phone || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalData: {
                          ...formData.personalData!,
                          emergencyContact: { ...formData.personalData!.emergencyContact, phone: e.target.value }
                        }
                      })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 disabled:bg-slate-50"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: JOB & ORGANIZATION                                                 */}
          {/* ========================================================================= */}
          {activeTab === 'job' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Employee ID *</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.id || ''}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Designation / Role Title *</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Senior Software Architect"
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Department *</label>
                  <select
                    disabled={!isEditing}
                    value={formData.department || 'Engineering'}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50 font-medium"
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

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Employment Type</label>
                  <select
                    disabled={!isEditing}
                    value={formData.employmentType || 'Full-time'}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as EmploymentType })}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50 font-medium"
                  >
                    <option value="Full-time">Full-time (Permanent)</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract / Consultant</option>
                    <option value="Intern">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Employment Status</label>
                  <select
                    disabled={!isEditing}
                    value={formData.status || 'Active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as EmployeeStatus })}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50 font-semibold"
                  >
                    <option value="Active">Active (HQ Office)</option>
                    <option value="Remote">Remote (WFH)</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Probation">Probation Period</option>
                    <option value="Terminated">Terminated / Resigned</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Date of Joining</label>
                  <input
                    type="date"
                    disabled={!isEditing}
                    value={formData.joinDate || '2023-01-01'}
                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Work Location / Branch</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA (HQ)"
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Reporting Line Manager</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.managerName || ''}
                    onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                    placeholder="e.g. Alex Rivera"
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50"
                  />
                </div>
              </div>

              {/* Skills & Competencies Manager */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-[11px] font-bold text-slate-700 block">Skills & Technology Stack</label>
                
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(formData.skills || []).map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 text-xs bg-indigo-50 border border-indigo-200 text-indigo-800 px-2.5 py-1 rounded-xl font-medium"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-rose-600 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {isEditing && (
                  <div className="flex items-center gap-2 max-w-sm">
                    <input
                      type="text"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                      placeholder="Add a new skill (e.g. GraphQL)..."
                      className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl flex-1 focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: DOCUMENTS VAULT                                                    */}
          {/* ========================================================================= */}
          {activeTab === 'documents' && (
            <div className="space-y-5">
              
              {/* Header & Upload Trigger */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Employee Documents & Compliance</h4>
                  <p className="text-xs text-slate-500">Official employment contracts, ID verification, and tax filings</p>
                </div>

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowDocUpload(!showDocUpload)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4" /> Upload Document
                  </button>
                )}
              </div>

              {/* Upload Document Form Widget */}
              {showDocUpload && isEditing && (
                <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200 space-y-3 animate-in fade-in duration-150">
                  <h5 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">Upload New Document</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-slate-700 block mb-1">Document Category</label>
                      <select
                        value={newDocType}
                        onChange={(e) => setNewDocType(e.target.value as DocumentType)}
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="Offer Letter">Offer Letter</option>
                        <option value="Identity Proof / Passport">Identity Proof / Passport</option>
                        <option value="Employment Contract">Employment Contract</option>
                        <option value="Tax Document (W-4 / Form 16)">Tax Document (W-4 / Form 16)</option>
                        <option value="Non-Disclosure Agreement (NDA)">Non-Disclosure Agreement (NDA)</option>
                        <option value="Educational Degree">Educational Degree</option>
                        <option value="Background Verification">Background Verification</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-700 block mb-1">Document Title / File Name</label>
                      <input
                        type="text"
                        value={newDocName}
                        onChange={(e) => setNewDocName(e.target.value)}
                        placeholder="e.g. Passport_Scan_2026.pdf"
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowDocUpload(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddDocument}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                    >
                      Confirm Upload
                    </button>
                  </div>
                </div>
              )}

              {/* Documents Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                {(!formData.documents || formData.documents.length === 0) ? (
                  <div className="p-8 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-xs font-medium">No documents uploaded yet for this employee.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Document Title</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Upload Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {formData.documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <FileCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                              <span className="font-semibold text-slate-900">{doc.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">({doc.fileSize})</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-medium">{doc.type}</td>
                          <td className="py-3 px-4 text-slate-500">{doc.uploadDate}</td>
                          <td className="py-3 px-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              doc.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                              doc.status === 'Pending Review' ? 'bg-amber-100 text-amber-800' :
                              'bg-rose-100 text-rose-800'
                            }`}>
                              {doc.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => alert(`Downloading verified copy of: ${doc.name}`)}
                              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <Download className="w-3 h-3" /> Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: SALARY & COMPENSATION STRUCTURE                                    */}
          {/* ========================================================================= */}
          {activeTab === 'salary' && (
            <div className="space-y-6">
              
              {/* Annual Compensation Input Bar */}
              <div className="p-4 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">Annual Base Compensation (CTC)</h4>
                  <p className="text-xs text-emerald-800">Defines salary grade, monthly payroll disbursement & statutory taxes</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-700">$</span>
                  <input
                    type="number"
                    disabled={!isEditing}
                    value={formData.salaryStructure?.annualBaseSalary || 120000}
                    onChange={(e) => handleAnnualSalaryChange(Number(e.target.value))}
                    step={1000}
                    min={30000}
                    className="w-36 text-base font-extrabold p-2 bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-slate-900 disabled:bg-slate-50"
                  />
                  <span className="text-xs font-bold text-emerald-900">/ Year</span>
                </div>
              </div>

              {/* Monthly Salary Breakdown Table */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                  <span>Monthly Payroll Component Breakdown</span>
                  <span className="text-emerald-700 font-extrabold text-sm">
                    Net Take-Home: ${formData.salaryStructure?.breakdown.netMonthlySalary.toLocaleString()} / mo
                  </span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {/* Basic Pay */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <div className="text-[11px] text-slate-500">Basic Pay (50%)</div>
                    <div className="text-sm font-bold text-slate-900 mt-1">
                      ${formData.salaryStructure?.breakdown.basicPay.toLocaleString()}
                    </div>
                  </div>

                  {/* HRA */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <div className="text-[11px] text-slate-500">House Rent (HRA 25%)</div>
                    <div className="text-sm font-bold text-slate-900 mt-1">
                      ${formData.salaryStructure?.breakdown.hra.toLocaleString()}
                    </div>
                  </div>

                  {/* Special Allowance */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <div className="text-[11px] text-slate-500">Special Allowance</div>
                    <div className="text-sm font-bold text-slate-900 mt-1">
                      ${formData.salaryStructure?.breakdown.specialAllowance.toLocaleString()}
                    </div>
                  </div>

                  {/* Performance Bonus */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <div className="text-[11px] text-slate-500">Performance Bonus</div>
                    <div className="text-sm font-bold text-slate-900 mt-1">
                      ${formData.salaryStructure?.breakdown.performanceBonus.toLocaleString()}
                    </div>
                  </div>

                  {/* 401k / PF */}
                  <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-100">
                    <div className="text-[11px] text-rose-700">401(k) / PF (Deduction)</div>
                    <div className="text-sm font-bold text-rose-900 mt-1">
                      -${formData.salaryStructure?.breakdown.providentFundOr401k.toLocaleString()}
                    </div>
                  </div>

                  {/* Income Tax */}
                  <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-100">
                    <div className="text-[11px] text-rose-700">Federal/State Tax</div>
                    <div className="text-sm font-bold text-rose-900 mt-1">
                      -${formData.salaryStructure?.breakdown.taxDeduction.toLocaleString()}
                    </div>
                  </div>

                  {/* Medical Insurance */}
                  <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-100">
                    <div className="text-[11px] text-rose-700">Health Insurance</div>
                    <div className="text-sm font-bold text-rose-900 mt-1">
                      -${formData.salaryStructure?.breakdown.healthInsuranceDeduction.toLocaleString()}
                    </div>
                  </div>

                  {/* Total Net Take-Home */}
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <div className="text-[11px] text-emerald-800 font-semibold">Net Disbursed</div>
                    <div className="text-sm font-extrabold text-emerald-950 mt-1">
                      ${formData.salaryStructure?.breakdown.netMonthlySalary.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Deposit Bank Details */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-indigo-600" /> Direct Deposit Bank Credentials
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-700 block mb-1">Bank Name</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.salaryStructure?.bankDetails?.bankName || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        salaryStructure: {
                          ...formData.salaryStructure!,
                          bankDetails: { ...formData.salaryStructure!.bankDetails, bankName: e.target.value }
                        }
                      })}
                      placeholder="e.g. JPMorgan Chase"
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-700 block mb-1">Account Number</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.salaryStructure?.bankDetails?.accountNumber || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        salaryStructure: {
                          ...formData.salaryStructure!,
                          bankDetails: { ...formData.salaryStructure!.bankDetails, accountNumber: e.target.value }
                        }
                      })}
                      placeholder="•••••••• 1234"
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-700 block mb-1">Routing / IFSC Code</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.salaryStructure?.bankDetails?.routingOrIfsc || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        salaryStructure: {
                          ...formData.salaryStructure!,
                          bankDetails: { ...formData.salaryStructure!.bankDetails, routingOrIfsc: e.target.value }
                        }
                      })}
                      placeholder="021000021"
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 font-mono"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div>
              {!isNewEmployee && onDelete && isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Are you sure you want to remove ${formData.name} from active records?`)) {
                      onDelete(formData.id!);
                      onClose();
                    }
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Terminate & Delete Record
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Close
              </button>

              {isEditing && (
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Record
                </button>
              )}
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

