// Load environment variables
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from .env.local, falling back to .env
config({ path: join(__dirname, '../.env.local') });
config({ path: join(__dirname, '../.env') });

import { initializeDatabase } from '../lib/db';

async function main() {
  try {
    console.log('🚀 Initializing RadMed database...');
    await initializeDatabase();
    console.log('✅ Database initialized successfully!');
    
    console.log('📋 Database schema created:');
    console.log('   - users table');
    console.log('   - reports table');
    console.log('   - indexes created');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

main();
