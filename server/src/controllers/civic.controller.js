const civicInfoService = require('../services/civicInfo.service');
const { getPool } = require('../db/postgres');
const { CivicApiError } = require('../utils/errors');

/**
 * Controller to fetch global elections using PostgreSQL caching (24 hr expiry limit).
 */
const getElections = async (req, res, next) => {
  try {
    let client = null;
    
    // Attempt Cache Hit if not in test
    if (process.env.NODE_ENV !== 'test') {
      client = await getPool().connect();
      try {
        const result = await client.query(`
          SELECT data FROM elections_cache 
          WHERE expires_at > CURRENT_TIMESTAMP 
          ORDER BY updated_at DESC LIMIT 1
        `);

        if (result.rows.length > 0) {
          // Cache hit: unexpired data
          return res.json({ source: 'cache', data: result.rows[0].data });
        }
      } catch (dbError) {
        console.error('Postgres Cache Read Error:', dbError.message);
        // We catch and squelch DB errors so a missing DB connection falls back to the live API
      }
    }

    // Cache Miss or No DB: Fetch live data
    const liveData = await civicInfoService.getElections();

    // Cache Write
    if (client) {
      try {
        // Set expiry for 24 hours from now
        await client.query(`
          INSERT INTO elections_cache (data, expires_at) 
          VALUES ($1, CURRENT_TIMESTAMP + INTERVAL '24 hours')
        `, [JSON.stringify(liveData)]);

        // Keep table small by deleting expired records
        await client.query(`DELETE FROM elections_cache WHERE expires_at <= CURRENT_TIMESTAMP`);
      } catch (dbError) {
        console.error('Postgres Cache Write Error:', dbError.message);
      } finally {
        client.release();
      }
    }

    return res.json({ source: 'api', data: liveData });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch specific Voter info based on location.
 * ZERO-PII RULE: We never cache `address` or write it anywhere. Passing directly.
 */
const getVoterInfo = async (req, res, next) => {
  try {
    const { address, electionId } = req.query;

    if (!address) {
      throw new CivicApiError('Address query parameter is required.', 400);
    }

    const voterData = await civicInfoService.getVoterInfo(address, electionId);

    // No DB writing, strict pass-through for privacy
    return res.json(voterData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getElections,
  getVoterInfo,
};
