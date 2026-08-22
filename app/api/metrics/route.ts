import { NextRequest, NextResponse } from 'next/server';
import { getDynamicMetrics } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { safeErrorResponse } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ('errorResponse' in auth) return auth.errorResponse;

    const { metrics, departmentStats } = await getDynamicMetrics();
    return NextResponse.json({
      success: true,
      data: {
        metrics,
        departmentStats
      }
    });
  } catch (error) {
    return safeErrorResponse(error, 'Failed to compute metrics');
  }
}

