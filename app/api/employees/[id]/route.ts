import { NextRequest, NextResponse } from 'next/server';
import { getEmployeeById, updateEmployee, deleteEmployee } from '@/lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
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
    console.error('Error fetching employee by ID:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch employee' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const updated = await updateEmployee(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: `Employee with ID ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update employee' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await deleteEmployee(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: `Employee with ID ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: `Employee ${id} deleted successfully` });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete employee' },
      { status: 500 }
    );
  }
}

