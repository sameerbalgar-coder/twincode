import { NextRequest, NextResponse } from 'next/server';
import { getEmployees, getAttendanceRecords, getLeaveRequests } from '@/lib/db';
import { 
  calculateSalaryBreakdown, 
  calculatePayableDays, 
  calculateProRatedPay 
} from '@/lib/admin/payroll-helpers';
import { EmployeePayrollRecord, PayrollSummaryMetrics } from '@/types/admin-payroll';
import { requireAdmin } from '@/lib/auth';
import { safeErrorResponse } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    // Strictly require Administrator role to view company-wide payroll records
    const auth = requireAdmin(request);
    if ('errorResponse' in auth) return auth.errorResponse;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const department = searchParams.get('department') || undefined;

    const [employees, attendance, leaves] = await Promise.all([
      getEmployees({ search, department }),
      getAttendanceRecords(),
      getLeaveRequests()
    ]);

    const totalWorkingDays = 22; // Standard cycle working days (August 2026)

    // Build authoritative payroll records
    const records: EmployeePayrollRecord[] = employees.map(emp => {
      let monthlyBase = 125000;
      if (emp.salaryStructure?.annualBaseSalary) {
        monthlyBase = Math.round(emp.salaryStructure.annualBaseSalary / 12);
        if (monthlyBase < 30000) monthlyBase = 85000;
      }

      const breakdown = emp.salaryStructure?.breakdown;
      const salaryStructure = calculateSalaryBreakdown(monthlyBase, {
        basic: typeof breakdown?.basicPay === 'number' ? breakdown.basicPay : undefined,
        hra: typeof breakdown?.hra === 'number' ? breakdown.hra : undefined,
        allowances: typeof breakdown?.specialAllowance === 'number' ? breakdown.specialAllowance : undefined,
        pfDeduction: typeof breakdown?.providentFundOr401k === 'number' ? breakdown.providentFundOr401k : undefined,
        taxDeduction: typeof breakdown?.taxDeduction === 'number' ? breakdown.taxDeduction : undefined
      });

      // Attendance integration: Unpaid leaves or absences
      const empAttendance = attendance.filter(a => a.employeeId === emp.id);
      const isAbsent = emp.status === 'On Leave' && !leaves.some(l => l.employeeId === emp.id && l.status === 'Approved');
      const unapprovedAbsenceDays = isAbsent ? 2 : 0;
      const unpaidLeaves = leaves.filter(l => l.employeeId === emp.id && l.leaveType === 'Unpaid Leave' && l.status === 'Approved')
        .reduce((sum, l) => sum + (l.allocationDays || (l as any).daysCount || 0), 0);

      const payableDays = calculatePayableDays(totalWorkingDays, unapprovedAbsenceDays, unpaidLeaves);

      const { proRatedGross, proRatedDeductions, netPay } = calculateProRatedPay(
        salaryStructure.grossSalary,
        salaryStructure.totalDeductions,
        totalWorkingDays,
        payableDays
      );

      return {
        employeeId: emp.id,
        employeeName: emp.name,
        employeeAvatar: emp.avatar,
        department: emp.department,
        role: emp.role,
        baseWage: salaryStructure.monthlyBaseWage,
        annualCTC: salaryStructure.annualCTC,
        totalWorkingDays,
        payableDays,
        unpaidAbsenceDays: unapprovedAbsenceDays + unpaidLeaves,
        grossPay: proRatedGross,
        totalDeductions: proRatedDeductions,
        netPay,
        salaryStructure,
        payrollStatus: 'Processed',
        paymentDate: '2026-08-31'
      };
    });

    // Summary Metrics
    const totalMonthlyOutflow = records.reduce((sum, r) => sum + r.netPay, 0);
    const totalDeductions = records.reduce((sum, r) => sum + r.totalDeductions, 0);
    const averageNetPay = records.length > 0 ? Math.round(totalMonthlyOutflow / records.length) : 0;
    const processedCount = records.filter(r => r.payrollStatus === 'Processed').length;

    const summary: PayrollSummaryMetrics = {
      totalMonthlyOutflow,
      totalDeductions,
      averageNetPay,
      processedCount,
      totalEmployees: records.length,
      payrollCycle: 'August 2026'
    };

    return NextResponse.json({
      success: true,
      summary,
      count: records.length,
      data: records
    });
  } catch (error) {
    return safeErrorResponse(error, 'Failed to fetch payroll records');
  }
}

