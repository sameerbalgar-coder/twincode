'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  LayoutGrid, 
  List, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUpRight, 
  Plane, 
  UserCheck, 
  UserX, 
  RefreshCw, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  ExternalLink
} from 'lucide-react';
import { DayflowNavigation } from '@/components/DayflowNavigation';
import { Employee, Department, EmployeeStatus, EmploymentType } from '@/types/hrms';
import { AdminEmployeeCard, DirectoryViewMode, EmployeeStatusIndicator, CreateEmployeeInput } from '@/types/admin-employee';
import { fetchEmployeesApi } from '@/lib/apiClient';

export default function AdminEmployeeDirectoryPage() {
  const router = useRouter();

  // State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [viewMode, setViewMode] = useState<DirectoryViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Loading & Modal States
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Employee Form Data
  const [newEmployee, setNewEmployee] = useState<CreateEmployeeInput>({
    name: '',
    email: '',
    designation: '',
    department: 'Engineering',
    employmentType: 'Full-time',
    location: 'San Francisco, CA (HQ)',
    phone: '+1 (555) 000-0000',
    managerName: 'Alex Rivera',
    monthlyBaseWage: 120000
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load dynamic employee directory
  const loadDirectory = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    else setIsRefreshing(true);
    setErrorMessage(null);

    try {
      const data = await fetchEmployeesApi({
        search: searchQuery || undefined,
        department: selectedDepartment !== 'All' ? selectedDepartment : undefined,
        status: selectedStatus !== 'All' ? selectedStatus : undefined
      });
      setEmployees(data);
    } catch (err: any) {
      console.error('Error loading employees:', err);
      setErrorMessage(err.message || 'Failed to load employee records from database.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [searchQuery, selectedDepartment, selectedStatus]);

  useEffect(() => {
    loadDirectory(true);
  }, [loadDirectory]);

  // Compute status indicator for card
  const getStatusIndicator = (emp: Employee): EmployeeStatusIndicator => {
    if (emp.status === 'On Leave') return 'airplane';
    if (emp.status === 'Active' || emp.status === 'Remote') return 'green';
    return 'yellow';
  };

  // Filtered Cards List
  const employeeCards: AdminEmployeeCard[] = useMemo(() => {
    let list = employees;
    if (selectedEmployee) {
      list = list.filter(e => e.id === selectedEmployee.id);
    }

    return list.map(emp => ({
      id: emp.id,
      name: emp.name,
      avatar: emp.avatar,
      designation: emp.role,
      department: emp.department,
      email: emp.email,
      phone: emp.phone,
      location: emp.location,
      managerName: emp.managerName,
      employmentType: emp.employmentType || 'Full-time',
      status: emp.status,
      statusIndicator: getStatusIndicator(emp),
      joinDate: emp.joinDate,
      skills: emp.skills || []
    }));
  }, [employees, selectedEmployee]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = employees.length;
    const present = employees.filter(e => e.status === 'Active' || e.status === 'Remote').length;
    const onLeave = employees.filter(e => e.status === 'On Leave').length;
    const remote = employees.filter(e => e.status === 'Remote').length;
    return { total, present, onLeave, remote };
  }, [employees]);

  // Handle Add New Employee Form Submit
  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: Partial<Employee> = {
        name: newEmployee.name,
        email: newEmployee.email,
        role: newEmployee.designation,
        department: newEmployee.department,
        employmentType: newEmployee.employmentType,
        location: newEmployee.location,
        phone: newEmployee.phone,
        managerName: newEmployee.managerName,
        status: 'Active',
        salary: `₹${(newEmployee.monthlyBaseWage || 120000) * 12}`,
        salaryStructure: {
          annualBaseSalary: (newEmployee.monthlyBaseWage || 120000) * 12,
          currency: '₹',
          payFrequency: 'Monthly',
          breakdown: {
            basicPay: Math.round((newEmployee.monthlyBaseWage || 120000) * 0.5),
            hra: Math.round((newEmployee.monthlyBaseWage || 120000) * 0.25),
            specialAllowance: Math.round((newEmployee.monthlyBaseWage || 120000) * 0.25),
            performanceBonus: 0,
            providentFundOr401k: Math.round((newEmployee.monthlyBaseWage || 120000) * 0.06),
            taxDeduction: Math.round((newEmployee.monthlyBaseWage || 120000) * 0.1),
            healthInsuranceDeduction: 1500,
            netMonthlySalary: Math.round((newEmployee.monthlyBaseWage || 120000) * 0.84)
          },
          bankDetails: {
            bankName: 'HDFC Bank Ltd.',
            accountNumber: '•••••••• 4892',
            routingOrIfsc: 'HDFC0001234',
            accountType: 'Savings'
          }
        },
        personalData: {
          dateOfBirth: '1995-06-15',
          gender: 'Female',
          maritalStatus: 'Single',
          bloodGroup: 'O+',
          nationality: 'Indian',
          residentialAddress: 'Tower 4, Mindspace Tech Park, Hyderabad, India',
          emergencyContact: {
            name: 'Priya Sharma',
            relationship: 'Sister',
            phone: '+91 98765 43210'
          }
        }
      };

      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to create employee');

      showToast(`Employee ${json.data.name} added successfully!`);
      setIsAddModalOpen(false);
      setNewEmployee({
        name: '',
        email: '',
        designation: '',
        department: 'Engineering',
        employmentType: 'Full-time',
        location: 'San Francisco, CA (HQ)',
        phone: '+1 (555) 000-0000',
        managerName: 'Alex Rivera',
        monthlyBaseWage: 120000
      });
      loadDirectory(false);
    } catch (err: any) {
      console.error('Error creating employee:', err);
      alert(err.message || 'Error creating employee record');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Status Badge
  const renderStatusBadge = (indicator: EmployeeStatusIndicator, statusText: string) => {
    switch (indicator) {
      case 'green':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {statusText === 'Remote' ? 'Remote (Present)' : 'Present'}
          </span>
        );
      case 'airplane':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
            <Plane className="w-3 h-3 text-purple-600" />
            On Approved Leave
          </span>
        );
      case 'yellow':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Absent (Unapproved)
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-slate-800 flex flex-col">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Header Navigation & Employee Switcher */}
      <DayflowNavigation
        employees={employees}
        selectedEmployee={selectedEmployee}
        onSelectEmployee={(emp) => {
          setSelectedEmployee(emp);
          if (emp) showToast(`Filtered directory for ${emp.name}`);
          else showToast('Viewing all employees in directory');
        }}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1">
        
        {/* Header Ribbon & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Employee Directory</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full border border-indigo-200">
                {metrics.total} Registered Staff
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Search, filter, inspect 360° dossiers, and configure employee records with full admin permissions.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* View Mode Toggle: Grid vs List */}
            <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs flex items-center">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={() => loadDirectory(false)}
              disabled={isRefreshing}
              className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
              title="Refresh directory"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            </button>

            {/* Add New Employee Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add New Employee
            </button>
          </div>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Total Headcount</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{metrics.total}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Across all departments</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="text-[10px] font-bold text-emerald-600 uppercase">Present Today</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{metrics.present}</div>
            <div className="text-[11px] text-emerald-700 mt-0.5">Active at desk & remote</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="text-[10px] font-bold text-purple-600 uppercase">On Approved Leave</div>
            <div className="text-2xl font-black text-purple-600 mt-1">{metrics.onLeave}</div>
            <div className="text-[11px] text-purple-700 mt-0.5">Authorized time off</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="text-[10px] font-bold text-sky-600 uppercase">Remote WFH</div>
            <div className="text-2xl font-black text-sky-600 mt-1">{metrics.remote}</div>
            <div className="text-[11px] text-sky-700 mt-0.5">VPN active connections</div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-xl">
            {/* Text Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, role, ID, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="People Operations">People Operations</option>
              <option value="Sales & Marketing">Sales & Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Customer Success">Customer Success</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active / Present</option>
              <option value="On Leave">On Leave</option>
              <option value="Remote">Remote</option>
              <option value="Probation">Probation</option>
            </select>
          </div>

          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Showing {employeeCards.length} members
          </span>
        </div>

        {/* Employee Cards Grid or List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-200" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-28" />
                    <div className="h-3 bg-slate-100 rounded w-20" />
                  </div>
                </div>
                <div className="h-10 bg-slate-50 rounded-xl" />
                <div className="h-8 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : employeeCards.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-2xs">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No employees found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search keywords.</p>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View matching Excalidraw Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {employeeCards.map((card) => (
              <div
                key={card.id}
                onClick={() => router.push(`/admin/profile/${card.id}`)}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-lg hover:border-indigo-200 transition-all p-5 space-y-4 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Top: Avatar, Name, Designation & Status Indicator */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={card.avatar}
                          alt={card.name}
                          className="w-13 h-13 rounded-2xl object-cover ring-2 ring-slate-100 shadow-xs group-hover:ring-indigo-300 transition-all"
                        />
                        <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                          card.statusIndicator === 'green' ? 'bg-emerald-500' :
                          card.statusIndicator === 'airplane' ? 'bg-purple-500' : 'bg-amber-500'
                        }`} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                          {card.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium truncate">{card.designation}</p>
                        <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{card.id}</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-xl bg-slate-100 text-slate-700 shrink-0">
                      {card.department}
                    </span>
                  </div>

                  {/* Status Indicator Pill */}
                  <div className="mt-3.5">
                    {renderStatusBadge(card.statusIndicator, card.status)}
                  </div>

                  {/* Info Metadata */}
                  <div className="mt-4 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{card.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{card.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{card.location}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400">
                    Joined {card.joinDate}
                  </span>
                  
                  <Link
                    href={`/admin/profile/${card.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-bold text-indigo-600 group-hover:text-indigo-800 flex items-center gap-1 hover:underline"
                  >
                    Manage Profile <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Employee</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {employeeCards.map((card) => (
                    <tr
                      key={card.id}
                      onClick={() => router.push(`/admin/profile/${card.id}`)}
                      className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={card.avatar}
                            alt={card.name}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{card.name}</div>
                            <div className="text-[11px] text-slate-400 font-medium">
                              <span className="font-mono">{card.id}</span> • {card.designation}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {card.department}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        <div>{card.email}</div>
                        <div>{card.phone}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        {renderStatusBadge(card.statusIndicator, card.status)}
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {card.employmentType}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <Link
                          href={`/admin/profile/${card.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs inline-flex items-center gap-1 transition-all"
                        >
                          Profile <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Add New Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            
            <div className="p-5 bg-gradient-to-r from-indigo-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Add New Employee</h3>
                  <p className="text-xs text-indigo-200">Register new staff member into Dayflow HRMS</p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="p-6 space-y-4 text-xs">
              
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  placeholder="e.g. Maya Lin"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    placeholder="maya.lin@dayflow.io"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role / Designation *</label>
                  <input
                    type="text"
                    required
                    value={newEmployee.designation}
                    onChange={(e) => setNewEmployee({ ...newEmployee, designation: e.target.value })}
                    placeholder="e.g. Lead Frontend Architect"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department *</label>
                  <select
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value as Department })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500/20"
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
                  <label className="font-bold text-slate-700 block mb-1">Employment Type</label>
                  <select
                    value={newEmployee.employmentType}
                    onChange={(e) => setNewEmployee({ ...newEmployee, employmentType: e.target.value as EmploymentType })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Monthly Base Wage (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={newEmployee.monthlyBaseWage || 120000}
                    onChange={(e) => setNewEmployee({ ...newEmployee, monthlyBaseWage: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Office Location</label>
                  <input
                    type="text"
                    value={newEmployee.location}
                    onChange={(e) => setNewEmployee({ ...newEmployee, location: e.target.value })}
                    placeholder="San Francisco, CA (HQ)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Creating...' : 'Create Employee Record'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

