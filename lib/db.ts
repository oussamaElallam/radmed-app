import { neon } from '@neondatabase/serverless';

// Lazy database connection - only initialize when needed
let sql: any = null;

function getDb() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set');
    }
    sql = neon(process.env.DATABASE_URL);
  }
  return sql;
}

// Database schema initialization
// Drops existing tables and recreates with correct TEXT id types to avoid integer cast errors
export async function initializeDatabase() {
  try {
    const db = getDb();
    // 1. Drop tables if they exist (to handle previous incorrect schema)
    await db`DROP TABLE IF EXISTS reports`;
    await db`DROP TABLE IF EXISTS users`;

    // Create users table (synced with Clerk)
    await db`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        clerk_id TEXT UNIQUE NOT NULL,
        email TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        medical_license TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create reports table
    await db`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        user_id TEXT REFERENCES users(clerk_id),
        patient_id TEXT NOT NULL,
        image_url TEXT,
        image_filename TEXT,
        report_content TEXT,
        modality TEXT,
        status TEXT DEFAULT 'pending_review',
        ai_confidence DECIMAL(3,2),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create indexes
    await db`CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id)`;
    await db`CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at)`;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// User management functions
export async function createUser(clerkId: string, email: string, firstName?: string, lastName?: string) {
  try {
    const db = getDb();
    const result = await db`
      INSERT INTO users (id, clerk_id, email, first_name, last_name)
      VALUES (${clerkId}, ${clerkId}, ${email}, ${firstName || ''}, ${lastName || ''})
      ON CONFLICT (clerk_id) DO UPDATE SET
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        updated_at = NOW()
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
}

export async function getUser(clerkId: string) {
  try {
    const db = getDb();
    const result = await db`
      SELECT * FROM users WHERE clerk_id = ${clerkId}
    `;
    return result[0];
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
}

// Report management functions
export async function createReport(
  userId: string,
  patientId: string,
  reportContent: string,
  modality: string,
  imageFilename?: string,
  aiConfidence?: number
) {
  try {
    const db = getDb();
    const result = await db`
      INSERT INTO reports (user_id, patient_id, report_content, modality, image_filename, ai_confidence)
      VALUES (${userId}, ${patientId}, ${reportContent}, ${modality}, ${imageFilename || ''}, ${aiConfidence || null})
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Create report error:', error);
    throw error;
  }
}

export async function getUserReports(userId: string, limit = 20, offset = 0) {
  try {
    const db = getDb();
    const result = await db`
      SELECT * FROM reports 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return result;
  } catch (error) {
    console.error('Get user reports error:', error);
    throw error;
  }
}

export async function getReport(reportId: number, userId: string) {
  try {
    const db = getDb();
    const result = await db`
      SELECT * FROM reports 
      WHERE id = ${reportId} AND user_id = ${userId}
    `;
    return result[0];
  } catch (error) {
    console.error('Get report error:', error);
    throw error;
  }
}

export async function updateReportStatus(reportId: number, userId: string, status: string) {
  try {
    const db = getDb();
    const result = await db`
      UPDATE reports 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${reportId} AND user_id = ${userId}
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Update report status error:', error);
    throw error;
  }
}

export async function getDailyReportCount(userId: string) {
  try {
    const db = getDb();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const result = await db`
      SELECT COUNT(*)::int AS count FROM reports
      WHERE user_id = ${userId}
        AND created_at >= ${today.toISOString()}
        AND created_at < ${tomorrow.toISOString()}
    `;
    return result[0]?.count || 0;
  } catch (error) {
    console.error('Get daily report count error:', error);
    throw error;
  }
}
