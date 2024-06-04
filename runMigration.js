const fs = require('fs');
const path = require('path');
const connection = require('./app/utils/resourceRouter/connection');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

const runMigrations = async () => {
  try {
    // Create migrations table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT,
        migration VARCHAR(255) NOT NULL,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      )
    `);

    // Get list of applied migrations
    const [rows] = await connection.query('SELECT migration FROM migrations');
    const appliedMigrations = rows.map(row => row.migration);

    // Get list of migration files
    const migrationFiles = fs.readdirSync(MIGRATIONS_DIR);

    for (const file of migrationFiles) {
      if (!appliedMigrations.includes(file)) {
        // Read and execute migration file
        const filePath = path.join(MIGRATIONS_DIR, file);
        const sql = fs.readFileSync(filePath, 'utf-8');
        await connection.query(sql);

        // Record the migration as applied
        await connection.query('INSERT INTO migrations (migration) VALUES (?)', [file]);
        console.log(`Migration ${file} applied successfully.`);
      }
    }

    console.log('All migrations applied successfully.');
  } catch (error) {
    console.error('Error applying migrations:', error);
  } finally {
    connection.end();
  }
};

if (require.main === module) {
  runMigrations();
}
