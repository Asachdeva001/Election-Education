/**
 * @file postgres.js
 * @description Manages the initialization and connection pooling for PostgreSQL.
 * Handles the `elections_cache` table for caching external API responses.
 * Optimized with an index on `expires_at` for efficient cache cleanup.
 */

// --- Imports ---
const { Pool } = require('pg');
const logger = require('../utils/logger'); // Centralized GCP Logger

// --- State ---
let pool;

// --- Database Operations ---

/**
 * Initializes and retrieves the PostgreSQL connection pool.
 * Wraps instantiation in a lazy loader to gracefully handle missing .env files during tests.
 * 
 * @returns {Pool} The PostgreSQL connection pool.
 */
const getPool = () => {
  if (!pool) {
    if (!process.env.DB_HOST && process.env.NODE_ENV !== 'test') {
      logger.warn('PostgreSQL DB_HOST missing. Caching will be disabled or mocked.');
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

/**
 * Initializes the expected caching table (`elections_cache`) and creates indexes.
 * Does not execute if the environment is 'test'.
 */
const initializeDb = async () => {
  if (process.env.NODE_ENV === 'test') return;
  const client = await getPool().connect();
  try {
    // Stores election API responses. `expires_at` implements the 24-hour expiration policy
    // Creates an index on expires_at for O(log n) cleanup efficiency
    await client.query(`
      CREATE TABLE IF NOT EXISTS elections_cache (
        id SERIAL PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_expires_at ON elections_cache(expires_at);
    `);
    logger.info('PostgreSQL: elections_cache table and indexes initialized or verified.');
  } catch (error) {
    logger.error('Failed to initialize PostgreSQL structure:', { error: error.message });
  } finally {
    client.release();
  }
};

// --- Exports ---
module.exports = {
  getPool,
  initializeDb,
};
