import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reportId, content } = await request.json();

    if (!reportId || !content) {
      return NextResponse.json({ error: 'Report ID and content are required' }, { status: 400 });
    }

    // Update the report in the database
    const result = await sql`
      UPDATE reports 
      SET report_content = ${content}, status = 'reviewed', updated_at = NOW()
      WHERE id = ${reportId} AND user_id = ${userId}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Report not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      report: result[0],
      message: 'Report updated successfully' 
    });

  } catch (error) {
    console.error('Update report error:', error);
    return NextResponse.json({ 
      error: 'Failed to update report',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
