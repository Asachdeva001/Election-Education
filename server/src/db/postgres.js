const { Pool } = require('pg');

let pool;

// We wrap the pool instantiation in a lazy loader to gracefully handle missing .env files during tests
const getPool = () => {
  if (!pool) {
    if (!process.env.DB_HOST && process.env.NODE_ENV !== 'test') {
      console.warn('PostgreSQL DB_HOST missing. Caching will be disabled or mocked.');
    }
    
    pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'admin',
      database: process.env.DB_NAME || 'election_data',
      password: process.env.DB_PASS || 'password',
      port: process.env.DB_PORT || 5432,
    });
  }
  return pool;
};

// Initialize the expected caching table
const initializeDb = async () => {
  if (process.env.NODE_ENV === 'test') return;
  const client = await getPool().connect();
  try {
    // Stores election API responses. `expires_at` implements the 24-hour expiration policy
    await client.query(`
      CREATE TABLE IF NOT EXISTS elections_cache (
        id SERIAL PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL
      );
    `);
    console.log('PostgreSQL: elections_cache table initialized or verified.');
  } catch (error) {
    console.error('Failed to initialize PostgreSQL structure:', error.message);
  } finally {
    client.release();
  }
};

module.exports = {
  getPool,
  initializeDb,
};
