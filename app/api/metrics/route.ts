import { NextResponse } from 'next/server';
import { getDynamicMetrics } from '@/lib/db';

export async function GET() {
  try {
    const { metrics, departmentStats } = await getDynamicMetrics();
    return NextResponse.json({
      success: true,
      data: {
        metrics,
        departmentStats
      }
    });
  } catch (error) {
    console.error('Error computing metrics:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to compute metrics' },
      { status: 500 }
    );
  }
}

