'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  Save, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  ShieldAlert, 
  TrendingUp, 
  Building, 
  Lock, 
  HelpCircle,
  Loader2
} from 'lucide-react';
import { SalaryComponentConfig } from '@/types/admin-payroll';
import { 
  formatINR, 
  calculateSalaryBreakdown, 
  validateSalaryStructure 
} from '@/lib/admin/payroll-helpers';

interface SalaryInfoTabProps {
  employeeId: string;
  employeeName: string;
  initialSalaryConfig?: SalaryComponentConfig;
  onSaveSuccess?: (updatedConfig: SalaryComponentConfig) => void;
  isReadOnly?: boolean;
}

export const SalaryInfoTab: React.FC<SalaryInfoTabProps> = ({
  employeeId,
  employeeName,
  initialSalaryConfig,
  onSaveSuccess,
  isReadOnly = false
}) => {
  // Form State
  const [salaryConfig, setSalaryConfig] = useState<SalaryComponentConfig>(() => {
    if (initialSalaryConfig) return initialSalaryConfig;
    return calculateSalaryBreakdown(125000);
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Sync when initialSalaryConfig changes or fetch from API
  useEffect(() => {
    if (initialSalaryConfig) {
      setSalaryConfig(initialSalaryConfig);
    } else if (employeeId) {
      setIsLoading(true);
      fetch(`/api/payroll/${employeeId}`)
        .then(res => res.json())
        .then(json => {
          if (json.success && json.data.salaryStructure) {
            setSalaryConfig(json.data.salaryStructure);
          }
        })
        .catch(err => console.error('Error fetching employee salary:', err))
        .finally(() => setIsLoading(false));
    }
  }, [employeeId, initialSalaryConfig]);

  // Handle Monthly Base Wage Change (auto-recalculates components proportionally)
  const handleMonthlyWageChange = (monthlyWage: number) => {
    const sanitized = Math.max(0, monthlyWage || 0);
    const updated = calculateSalaryBreakdown(sanitized, {
      bankDetails: salaryConfig.bankDetails
    });
    setSalaryConfig(updated);
    validate(updated);
  };

  // Handle manual fine-tuning of individual components
  const handleComponentChange = (field: keyof SalaryComponentConfig, value: number) => {
    const sanitized = Math.max(0, value || 0);
    const updated: SalaryComponentConfig = {
      ...salaryConfig,
      [field]: sanitized
    };

    // Recalculate Gross, Deductions, and Net
    const grossSalary = (field === 'basic' ? sanitized : updated.basic) +
                        (field === 'hra' ? sanitized : updated.hra) +
                        (field === 'allowances' ? sanitized : updated.allowances);
    
    const totalDeductions = (field === 'pfDeduction' ? sanitized : updated.pfDeduction) +
                            (field === 'taxDeduction' ? sanitized : updated.taxDeduction) +
                            (updated.healthInsurance || 1500);

    const netTakeHome = Math.max(0, grossSalary - totalDeductions);

    updated.grossSalary = grossSalary;
    updated.totalDeductions = totalDeductions;
    updated.netTakeHome = netTakeHome;
    updated.annualCTC = updated.monthlyBaseWage * 12;

    setSalaryConfig(updated);
    validate(updated);
  };

  // Validation
  const validate = (config: SalaryComponentConfig) => {
    const res = validateSalaryStructure(config);
    setValidationErrors(res.errors);
    return res.isValid;
  };

  // Save handler via PUT /api/payroll/[employeeId]
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(salaryConfig)) return;

    setIsSaving(true);
    setSaveSuccessMessage(null);

    try {
      const res = await fetch(`/api/payroll/${employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salaryConfig)
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to update salary structure');

      setSaveSuccessMessage(`Salary structure for ${employeeName} updated successfully.`);
      if (onSaveSuccess) onSaveSuccess(json.data);
      setTimeout(() => setSaveSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Error saving salary structure:', err);
      setValidationErrors([err.message || 'Server error saving salary structure.']);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 animate-pulse space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-700">Loading Salary Configuration...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
      
      {/* Header Notice: Restricted Admin Scope */}
      <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold">Salary Info & Compensation Structure</h3>
              <span className="text-[10px] uppercase font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.2 rounded-full">
                Admin Confidential
              </span>
            </div>
            <p className="text-xs text-slate-400">Restricted payroll configuration in Indian Rupees (INR - ₹)</p>
          </div>
        </div>

        <span className="text-xs font-mono text-indigo-200 font-bold bg-white/10 px-2.5 py-1 rounded-lg">
          {employeeId}
        </span>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-6">
        
        {/* Success Alert */}
        {saveSuccessMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-900 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Please resolve the following input issues:</span>
            </div>
            <ul className="list-disc list-inside pl-2 text-[11px] text-rose-800">
              {validationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Live Calculation Preview Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-sm border border-indigo-950">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Gross Monthly Salary</span>
            <div className="text-xl font-black text-white mt-0.5">
              {formatINR(salaryConfig.grossSalary)}
            </div>
            <span className="text-[10px] text-indigo-300">Basic + HRA + Allowances</span>
          </div>

          <div className="border-t sm:border-t-0 sm:border-x border-slate-800 pt-2 sm:pt-0 sm:px-4">
            <span className="text-[10px] uppercase font-bold text-rose-300">Total Deductions</span>
            <div className="text-xl font-black text-rose-400 mt-0.5">
              -{formatINR(salaryConfig.totalDeductions)}
            </div>
            <span className="text-[10px] text-slate-400">PF + TDS + Health</span>
          </div>

          <div className="pt-2 sm:pt-0 sm:pl-2">
            <span className="text-[10px] uppercase font-bold text-emerald-400">Net Take-Home Pay</span>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">
              {formatINR(salaryConfig.netTakeHome)}
            </div>
            <span className="text-[10px] text-slate-400">Monthly Direct Deposit</span>
          </div>
        </div>

        {/* Primary Compensation Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Monthly Base Wage (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₹</span>
              <input
                type="number"
                disabled={isReadOnly}
                min={0}
                step={500}
                value={salaryConfig.monthlyBaseWage || 0}
                onChange={(e) => handleMonthlyWageChange(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-900 disabled:bg-slate-100"
                required
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Auto-calculates standard 50% Basic, 25% HRA, 25% Allowances
            </span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Annual CTC Equivalent (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₹</span>
              <input
                type="text"
                disabled
                value={salaryConfig.annualCTC.toLocaleString('en-IN')}
                className="w-full pl-8 pr-3 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl font-bold text-indigo-900"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              {formatINR(salaryConfig.annualCTC)} / Annum
            </span>
          </div>
        </div>

        {/* Detailed Component Breakdown Inputs */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
            <span>Salary Breakdown Components (Monthly)</span>
            <span className="text-[11px] font-semibold text-indigo-600">Manual fine-tuning allowed</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Basic Pay */}
            <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 block">Basic Pay (50%)</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-semibold text-slate-400 text-xs">₹</span>
                <input
                  type="number"
                  disabled={isReadOnly}
                  min={0}
                  value={salaryConfig.basic}
                  onChange={(e) => handleComponentChange('basic', Number(e.target.value))}
                  className="w-full pl-6 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white"
                />
              </div>
            </div>

            {/* HRA */}
            <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 block">House Rent Allowance (25%)</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-semibold text-slate-400 text-xs">₹</span>
                <input
                  type="number"
                  disabled={isReadOnly}
                  min={0}
                  value={salaryConfig.hra}
                  onChange={(e) => handleComponentChange('hra', Number(e.target.value))}
                  className="w-full pl-6 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white"
                />
              </div>
            </div>

            {/* Allowances */}
            <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 block">Special / Other Allowances</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-semibold text-slate-400 text-xs">₹</span>
                <input
                  type="number"
                  disabled={isReadOnly}
                  min={0}
                  value={salaryConfig.allowances}
                  onChange={(e) => handleComponentChange('allowances', Number(e.target.value))}
                  className="w-full pl-6 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white"
                />
              </div>
            </div>

            {/* PF Deduction */}
            <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-2xl space-y-1">
              <label className="text-[11px] font-semibold text-rose-800 block">Provident Fund (PF Deduction)</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-semibold text-rose-400 text-xs">₹</span>
                <input
                  type="number"
                  disabled={isReadOnly}
                  min={0}
                  value={salaryConfig.pfDeduction}
                  onChange={(e) => handleComponentChange('pfDeduction', Number(e.target.value))}
                  className="w-full pl-6 pr-2 py-1.5 text-xs bg-white border border-rose-200 rounded-xl font-bold text-rose-900"
                />
              </div>
            </div>

            {/* Tax / TDS */}
            <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-2xl space-y-1">
              <label className="text-[11px] font-semibold text-rose-800 block">Income Tax / TDS Deduction</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-semibold text-rose-400 text-xs">₹</span>
                <input
                  type="number"
                  disabled={isReadOnly}
                  min={0}
                  value={salaryConfig.taxDeduction}
                  onChange={(e) => handleComponentChange('taxDeduction', Number(e.target.value))}
                  className="w-full pl-6 pr-2 py-1.5 text-xs bg-white border border-rose-200 rounded-xl font-bold text-rose-900"
                />
              </div>
            </div>

            {/* Health Insurance */}
            <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-2xl space-y-1">
              <label className="text-[11px] font-semibold text-rose-800 block">Health Insurance / Medical</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-semibold text-rose-400 text-xs">₹</span>
                <input
                  type="number"
                  disabled={isReadOnly}
                  min={0}
                  value={salaryConfig.healthInsurance || 1500}
                  onChange={(e) => handleComponentChange('healthInsurance', Number(e.target.value))}
                  className="w-full pl-6 pr-2 py-1.5 text-xs bg-white border border-rose-200 rounded-xl font-bold text-rose-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bank & Payment Routing */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-indigo-600" /> Direct Deposit Bank Details (NEFT/RTGS/IMPS)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">Bank Name</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={salaryConfig.bankDetails?.bankName || ''}
                onChange={(e) => setSalaryConfig({
                  ...salaryConfig,
                  bankDetails: { ...salaryConfig.bankDetails!, bankName: e.target.value }
                })}
                placeholder="e.g. HDFC Bank Ltd."
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 font-medium"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">Account Number</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={salaryConfig.bankDetails?.accountNumber || ''}
                onChange={(e) => setSalaryConfig({
                  ...salaryConfig,
                  bankDetails: { ...salaryConfig.bankDetails!, accountNumber: e.target.value }
                })}
                placeholder="•••••••• 4892"
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">IFSC / Routing Code</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={salaryConfig.bankDetails?.ifscCode || ''}
                onChange={(e) => setSalaryConfig({
                  ...salaryConfig,
                  bankDetails: { ...salaryConfig.bankDetails!, ifscCode: e.target.value }
                })}
                placeholder="HDFC0001234"
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 font-mono uppercase"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {!isReadOnly && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-400">
              Changes take effect immediately on next payroll disbursement cycle.
            </span>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Structure
            </button>
          </div>
        )}

      </form>

    </div>
  );
};

