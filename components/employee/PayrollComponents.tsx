'use client';

import type { PayrollRecord, Allowance, Deduction } from '@/lib/types';
import { StatusBadge } from './UIComponents';
import { Skeleton, TableSkeleton } from './UIComponents';

interface PayrollCardProps {
  payroll: PayrollRecord;
}

export function PayrollCard({ payroll }: PayrollCardProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pay Period: {payroll.period}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(payroll.periodStart).toLocaleDateString()} - {new Date(payroll.periodEnd).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status={payroll.status} variant="payroll" />
          {payroll.paidAt && (
            <span className="text-sm text-gray-500 dark:text-gray-400">Paid: {new Date(payroll.paidAt).toLocaleDateString()}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Basic Salary</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(payroll.basicSalary, payroll.currency)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Gross Salary</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(payroll.grossSalary, payroll.currency)}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-400">Net Salary</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{formatCurrency(payroll.netSalary, payroll.currency)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {payroll.allowances.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Allowances
            </h4>
            <div className="space-y-2">
              {payroll.allowances.map((allowance) => (
                <div key={allowance.id} className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <span className="text-gray-500 dark:text-gray-400">{allowance.name}</span>
                  <span className="font-medium text-green-700 dark:text-green-400">
                    +{formatCurrency(allowance.amount, payroll.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {payroll.deductions.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Deductions
            </h4>
            <div className="space-y-2">
              {payroll.deductions.map((deduction) => (
                <div key={deduction.id} className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <span className="text-gray-500 dark:text-gray-400">{deduction.name}</span>
                  <span className="font-medium text-red-700 dark:text-red-400">
                    -{formatCurrency(deduction.amount, payroll.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">Generated on {new Date(payroll.generatedAt).toLocaleDateString()}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">Read-only view</span>
      </div>
    </div>
  );
}

interface PayrollListProps {
  payrolls: PayrollRecord[];
  loading?: boolean;
}

export function PayrollList({ payrolls, loading }: PayrollListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between">
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="80px" />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <Skeleton variant="rectangular" height="80px" />
              <Skeleton variant="rectangular" height="80px" />
              <Skeleton variant="rectangular" height="80px" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (payrolls.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 0 0-2.25 2.25v11.25c0 1.032.704 1.873 1.638 2.148a12.061 12.061 0 0 0 3.493 1.074.04.04 0 0 0 .08 0 12.06 12.06 0 0 0 3.493-1.074A2.244 2.244 0 0 0 18 16.5V3m-14.25 0h14.25" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No payroll records</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Your payroll information will appear here when available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payrolls.map((payroll) => (
        <PayrollCard key={payroll.id} payroll={payroll} />
      ))}
    </div>
  );
}

interface PayrollTableProps {
  payrolls: PayrollRecord[];
  loading?: boolean;
}

export function PayrollTable({ payrolls, loading }: PayrollTableProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <TableSkeleton rows={5} columns={6} />
      </div>
    );
  }

  if (payrolls.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 0 0-2.25 2.25v11.25c0 1.032.704 1.873 1.638 2.148a12.061 12.061 0 0 0 3.493 1.074.04.04 0 0 0 .08 0 12.06 12.06 0 0 0 3.493-1.074A2.244 2.244 0 0 0 18 16.5V3m-14.25 0h14.25" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No payroll records</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Your payroll information will appear here when available</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Period</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Basic Salary</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gross Salary</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Net Salary</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Generated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {payrolls.map((payroll) => (
              <tr key={payroll.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{payroll.period}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(payroll.periodStart).toLocaleDateString()} - {new Date(payroll.periodEnd).toLocaleDateString()}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(payroll.basicSalary, payroll.currency)}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(payroll.grossSalary, payroll.currency)}</td>
                <td className="px-4 py-3 text-sm font-bold text-blue-900 dark:text-blue-300">{formatCurrency(payroll.netSalary, payroll.currency)}</td>
                <td className="px-4 py-3"><StatusBadge status={payroll.status} variant="payroll" /></td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{new Date(payroll.generatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface PayrollDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  payroll: PayrollRecord | null;
}

export function PayrollDetailModal({ isOpen, onClose, payroll }: PayrollDetailModalProps) {
  if (!isOpen || !payroll) return null;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="payroll-detail-title">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 id="payroll-detail-title" className="text-lg font-semibold text-gray-900 dark:text-white">Payroll Details</h2>
            <button onClick={onClose} className="p-1 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pay Period: {payroll.period}</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {new Date(payroll.periodStart).toLocaleDateString()} - {new Date(payroll.periodEnd).toLocaleDateString()}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Basic Salary</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(payroll.basicSalary, payroll.currency)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Gross Salary</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(payroll.grossSalary, payroll.currency)}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-400">Net Salary</p>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-300">{formatCurrency(payroll.netSalary, payroll.currency)}</p>
              </div>
            </div>

            {payroll.allowances.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Allowances
                </h4>
                <div className="space-y-2">
                  {payroll.allowances.map((allowance) => (
                    <div key={allowance.id} className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <span className="text-gray-500 dark:text-gray-400">{allowance.name}</span>
                      <span className="font-medium text-green-700 dark:text-green-400">+{formatCurrency(allowance.amount, payroll.currency)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {payroll.deductions.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  Deductions
                </h4>
                <div className="space-y-2">
                  {payroll.deductions.map((deduction) => (
                    <div key={deduction.id} className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <span className="text-gray-500 dark:text-gray-400">{deduction.name}</span>
                      <span className="font-medium text-red-700 dark:text-red-400">-{formatCurrency(deduction.amount, payroll.currency)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
              <p>Generated: {new Date(payroll.generatedAt).toLocaleString()}</p>
              {payroll.paidAt && <p>Paid: {new Date(payroll.paidAt).toLocaleString()}</p>}
              <p>Status: <span className="capitalize">{payroll.status}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}