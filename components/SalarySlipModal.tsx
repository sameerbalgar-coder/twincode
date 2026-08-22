'use client';

import React from 'react';
import { 
  X, 
  Printer, 
  Building2, 
  Layers, 
  ShieldCheck, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  Download,
  CheckCircle2
} from 'lucide-react';
import { EmployeePayrollRecord } from '@/types/admin-payroll';
import { formatINR } from '@/lib/admin/payroll-helpers';

interface SalarySlipModalProps {
  record: EmployeePayrollRecord;
  isOpen: boolean;
  onClose: () => void;
}

export const SalarySlipModal: React.FC<SalarySlipModalProps> = ({
  record,
  isOpen,
  onClose
}) => {
  if (!isOpen || !record) return null;

  const handlePrint = () => {
    window.print();
  };

  const struct = record.salaryStructure;
  const basic = struct?.basic || Math.round(record.baseWage * 0.5);
  const hra = struct?.hra || Math.round(record.baseWage * 0.25);
  const allowances = struct?.allowances || Math.round(record.baseWage * 0.25);
  const pf = struct?.pfDeduction || Math.round(basic * 0.12);
  const tax = struct?.taxDeduction || Math.round(record.baseWage * 0.10);
  const health = struct?.healthInsurance || 1500;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden print:shadow-none print:border-none print:max-w-full">
        
        {/* Modal Top Control Bar (Hidden when printing) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Official Salary Statement</h3>
              <p className="text-[11px] text-slate-400">Pay Period: August 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Document Area */}
        <div className="p-8 space-y-6 text-xs text-slate-800" id="printable-salary-slip">
          
          {/* Header Section */}
          <div className="border-b-2 border-indigo-600 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <Layers className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">DAYFLOW HRMS TECHNOLOGIES</h1>
                <p className="text-[11px] text-slate-500 font-medium">Enterprise Human Resource & Payroll Systems</p>
                <p className="text-[10px] text-slate-400">Corporate HQ • Bangalore / Remote Global Operations</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-full font-bold text-xs">
                SALARY SLIP • AUG 2026
              </span>
              <div className="text-[10px] text-slate-500 font-mono mt-1">
                Ref: <strong className="text-slate-700">PAY-{record.employeeId}-202608</strong>
              </div>
              <div className="text-[10px] text-slate-400">Disbursement: Aug 31, 2026</div>
            </div>
          </div>

          {/* Employee Dossier Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Employee Name</span>
              <span className="font-bold text-slate-900 text-xs">{record.employeeName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Employee ID</span>
              <span className="font-mono font-bold text-indigo-700 text-xs">{record.employeeId}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Designation</span>
              <span className="font-semibold text-slate-800 text-xs">{record.role}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Department</span>
              <span className="font-semibold text-slate-800 text-xs">{record.department}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Working Days</span>
              <span className="font-bold text-slate-900 text-xs">{record.totalWorkingDays} Days</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Payable Days</span>
              <span className="font-bold text-emerald-700 text-xs">{record.payableDays} Days</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Bank & Account</span>
              <span className="font-medium text-slate-800 text-xs">
                {struct?.bankDetails?.bankName || 'HDFC Bank'} ({struct?.bankDetails?.accountNumber || '••••4892'})
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Payment Status</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 text-xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Direct Deposit
              </span>
            </div>
          </div>

          {/* Earnings & Deductions Breakdown Tables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Column 1: Earnings */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="bg-slate-100/80 px-4 py-2.5 font-bold text-slate-900 border-b border-slate-200 flex items-center justify-between">
                <span>Earnings (Allowances)</span>
                <span className="text-[11px] text-slate-500 font-normal">Amount (₹)</span>
              </div>
              <div className="divide-y divide-slate-100 bg-white">
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-slate-600">Basic Salary</span>
                  <span className="font-mono font-semibold text-slate-900">{formatINR(basic)}</span>
                </div>
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-slate-600">House Rent Allowance (HRA)</span>
                  <span className="font-mono font-semibold text-slate-900">{formatINR(hra)}</span>
                </div>
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-slate-600">Special & Performance Allowance</span>
                  <span className="font-mono font-semibold text-slate-900">{formatINR(allowances)}</span>
                </div>
                <div className="px-4 py-2.5 bg-indigo-50/50 flex items-center justify-between font-bold text-indigo-950 border-t border-indigo-100">
                  <span>Gross Earnings</span>
                  <span className="font-mono">{formatINR(record.grossPay)}</span>
                </div>
              </div>
            </div>

            {/* Column 2: Deductions */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="bg-slate-100/80 px-4 py-2.5 font-bold text-slate-900 border-b border-slate-200 flex items-center justify-between">
                <span>Deductions & Taxes</span>
                <span className="text-[11px] text-slate-500 font-normal">Amount (₹)</span>
              </div>
              <div className="divide-y divide-slate-100 bg-white">
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-slate-600">Provident Fund (Employee PF)</span>
                  <span className="font-mono font-semibold text-rose-700">-{formatINR(pf)}</span>
                </div>
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-slate-600">Income Tax / TDS</span>
                  <span className="font-mono font-semibold text-rose-700">-{formatINR(tax)}</span>
                </div>
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-slate-600">Health & Medical Insurance</span>
                  <span className="font-mono font-semibold text-rose-700">-{formatINR(health)}</span>
                </div>
                <div className="px-4 py-2.5 bg-rose-50/50 flex items-center justify-between font-bold text-rose-950 border-t border-rose-100">
                  <span>Total Deductions</span>
                  <span className="font-mono">-{formatINR(record.totalDeductions)}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Net Take-Home Highlight Card */}
          <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">
                Net Pay Deposited (Gross - Deductions)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-0.5">
                {formatINR(record.netPay)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Credited directly to {struct?.bankDetails?.bankName || 'HDFC Bank'} Account • Reference: TXN-892189
              </div>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Annual CTC Equivalent</span>
              <div className="text-lg font-bold text-white font-mono mt-0.5">
                {formatINR(record.annualCTC)}
              </div>
              <div className="text-[10px] text-indigo-300">₹{(record.annualCTC / 100000).toFixed(2)} LPA Package</div>
            </div>
          </div>

          {/* Footer Signatures */}
          <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
            <div>
              <p className="font-semibold text-slate-600">Authorized Signatory</p>
              <p>Dayflow Payroll & Finance Operations</p>
            </div>
            <div className="text-right">
              <p>This is a computer-generated statement.</p>
              <p>No physical signature is required under IT Act 2000.</p>
            </div>
          </div>

        </div>

        {/* Modal Bottom Close Bar (Hidden when printing) */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print Payslip
          </button>
        </div>

      </div>
    </div>
  );
};

