const { query, testConnection } = require('../src/lib/db');
const { readFile } = require('fs/promises');
const path = require('path');

async function runSeed() {
  try {
    console.log('🚀 Starting database seeding...');
    
    // Test database connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Database connection failed. Please check your database configuration.');
      process.exit(1);
    }

    // Read the seed file
    const seedPath = path.join(process.cwd(), 'db/seed.sql');
    console.log(`📖 Reading seed file: ${seedPath}`);
    
    let seedSql;
    try {
      seedSql = await readFile(seedPath, 'utf8');
    } catch (error) {
      console.error('❌ Error reading seed file:', error);
      console.log('Current working directory:', process.cwd());
      console.log('Trying to list db directory...');
      const fs = require('fs');
      try {
        const files = fs.readdirSync(path.join(process.cwd(), 'db'));
        console.log('Files in db directory:', files);
      } catch (dirError) {
        console.error('Error reading db directory:', dirError);
      }
      throw error;
    }
    
    // Split the SQL into individual statements and execute them
    const statements = seedSql
      .split(';')
      .map((statement: string) => statement.trim())
      .filter((statement: string) => statement.length > 0);

    console.log(`🔁 Found ${statements.length} SQL statements to execute`);
    
    for (const [index, statement] of statements.entries()) {
      try {
        console.log(`   [${index + 1}/${statements.length}] Executing statement...`);
        await query(statement);
      } catch (error) {
        console.error(`❌ Error executing statement ${index + 1}:`, error);
        console.error('Failed statement:', statement);
        throw error; // Stop execution on error
      }
    }
    
    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
runSeed();
