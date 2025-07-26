import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserReports } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const reports = await getUserReports(userId, limit, offset);

    const formattedReports = reports.map((report: any) => ({
      id: report.id,
      patientId: report.patient_id,
      modality: report.modality,
      status: report.status,
      createdAt: report.created_at,
      updatedAt: report.updated_at,
      content: report.report_content,
      confidence: report.ai_confidence,
      filename: report.image_filename
    }));

    return NextResponse.json({
      success: true,
      reports: formattedReports,
      pagination: {
        limit,
        offset,
        total: formattedReports.length
      }
    });

  } catch (error) {
    console.error('Get reports history API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
