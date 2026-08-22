import { NextRequest, NextResponse } from 'next/server';
import { getEmployees, getAttendanceRecords, getLeaveRequests } from '@/lib/db';
import { 
  calculateSalaryBreakdown, 
  calculatePayableDays, 
  calculateProRatedPay 
} from '@/lib/admin/payroll-helpers';
import { EmployeePayrollRecord, PayrollSummaryMetrics } from '@/types/admin-payroll';

export async function GET(request: NextRequest) {
  try {
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
      // Determine monthly base wage in INR (convert USD numbers or standard INR range)
      let monthlyBase = 125000;
      if (emp.salaryStructure?.annualBaseSalary) {
        // e.g. If annual is 145000 USD, in INR scale we map it to standard monthly base like ₹1,20,000
        monthlyBase = Math.round(emp.salaryStructure.annualBaseSalary / 12);
        if (monthlyBase < 30000) monthlyBase = 85000; // minimum benchmark
      }

      const salaryStructure = calculateSalaryBreakdown(monthlyBase, {
        basic: emp.salaryStructure?.breakdown.basicPay,
        hra: emp.salaryStructure?.breakdown.hra,
        allowances: emp.salaryStructure?.breakdown.specialAllowance,
        pfDeduction: emp.salaryStructure?.breakdown.providentFundOr401k,
        taxDeduction: emp.salaryStructure?.breakdown.taxDeduction
      });

      // Attendance integration: Unpaid leaves or absences
      const empAttendance = attendance.filter(a => a.employeeId === emp.id);
      const isAbsent = emp.status === 'On Leave' && !leaves.some(l => l.employeeId === emp.id && l.status === 'Approved');
      const unapprovedAbsenceDays = isAbsent ? 2 : 0;
      const unpaidLeaves = leaves.filter(l => l.employeeId === emp.id && l.leaveType === 'Unpaid Leave' && l.status === 'Approved')
        .reduce((sum, l) => sum + l.allocationDays, 0);

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
    console.error('Error fetching payroll records:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch payroll records' },
      { status: 500 }
    );
  }
}

