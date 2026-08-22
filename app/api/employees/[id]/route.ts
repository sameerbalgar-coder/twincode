import { NextRequest, NextResponse } from 'next/server';
import { getEmployeeById, updateEmployee, deleteEmployee, getEmployees } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';
import { 
  sanitizeAdminEmployeePayload, 
  sanitizeEmployeeSelfUpdatePayload, 
  safeErrorResponse 
} from '@/lib/security';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const auth = requireAuth(request);
    if ('errorResponse' in auth) return auth.errorResponse;

    const { id } = await context.params;
    const employee = await getEmployeeById(id);

    if (!employee) {
      return NextResponse.json(
        { success: false, message: `Employee with ID ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: employee });
  } catch (error) {
    return safeErrorResponse(error, 'Failed to fetch employee');
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const auth = requireAuth(request);
    if ('errorResponse' in auth) return auth.errorResponse;
    const { session } = auth;

    const { id } = await context.params;
    const body = await request.json();

    let sanitizedPayload: Record<string, any>;

    if (session.role === 'admin') {
      // Admin can update all authorized fields
      sanitizedPayload = sanitizeAdminEmployeePayload(body);
    } else {
      // Employee can ONLY update their own personal contact details
      if (session.employeeId !== id) {
        return NextResponse.json(
          { success: false, message: 'Forbidden: You can only update your own profile.' },
          { status: 403 }
        );
      }
      sanitizedPayload = sanitizeEmployeeSelfUpdatePayload(body);
    }

    const updated = await updateEmployee(id, sanitizedPayload);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: `Employee with ID ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return safeErrorResponse(error, 'Failed to update employee');
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // Only Administrators can delete employees
    const auth = requireAdmin(request);
    if ('errorResponse' in auth) return auth.errorResponse;

    const { id } = await context.params;
    const targetEmployee = await getEmployeeById(id);

    if (!targetEmployee) {
      return NextResponse.json(
        { success: false, message: `Employee with ID ${id} not found` },
        { status: 404 }
      );
    }

    // Last Admin Protection
    const allEmployees = await getEmployees();
    const isTargetAdmin = targetEmployee.role?.toLowerCase().includes('admin') || 
                          targetEmployee.department?.toLowerCase().includes('admin');
    
    if (isTargetAdmin) {
      const adminCount = allEmployees.filter(e => 
        e.role?.toLowerCase().includes('admin') || 
        e.department?.toLowerCase().includes('admin')
      ).length;

      if (adminCount <= 1) {
        return NextResponse.json(
          { success: false, message: 'Security restriction: Cannot delete the last remaining administrator account.' },
          { status: 400 }
        );
      }
    }

    const deleted = await deleteEmployee(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: `Employee with ID ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: `Employee ${id} deleted successfully` });
  } catch (error) {
    return safeErrorResponse(error, 'Failed to delete employee');
  }
}

