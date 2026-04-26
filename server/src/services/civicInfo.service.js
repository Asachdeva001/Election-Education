const axios = require('axios');
const { CivicApiError } = require('../utils/errors');

const CIVIC_INFO_API_URL = 'https://civicinfo.googleapis.com/civicinfo/v2';

/**
 * Validates that the API Key is present in the environment.
 */
const getApiKey = () => {
  const key = process.env.CIVIC_INFO_API_KEY;
  if (!key) {
    throw new CivicApiError('Server Configuration Error: Missing Civic Info API Key.', 500);
  }
  return key;
};

/**
 * Fetches a list of upcoming elections from the Google Civic Information API.
 * @returns {Promise<Array>} List of elections.
 */
const getElections = async () => {
  try {
    const key = getApiKey();
    const response = await axios.get(`${CIVIC_INFO_API_URL}/elections`, {
      params: { key },
    });
    
    // Ensure we only return necessary data (zero-PII is already guaranteed here as it's public info)
    return response.data.elections || [];
  } catch (error) {
    if (error instanceof CivicApiError) throw error;
    
    // Log the actual error internally (omitted for brevity, could use a logger)
    throw new CivicApiError('Failed to fetch elections data.', error.response?.status || 500);
  }
};

/**
 * Fetches voter info including polling locations based on an address.
 * @param {string} address - The residential address to query.
 * @param {number} [electionId] - Optional election ID.
 * @returns {Promise<Object>} Polling locations, early voting sites, and contest data.
 */
const getVoterInfo = async (address, electionId = null) => {
  if (!address) {
    throw new CivicApiError('Address is required to fetch voter information.', 400);
  }

  try {
    const key = getApiKey();
    const params = {
      key,
      address,
    };
    
    if (electionId) {
      params.electionId = electionId;
    }

    const response = await axios.get(`${CIVIC_INFO_API_URL}/voterinfo`, { params });

    /* 
      Zero-PII Storage Compliance:
      We fetch the data using the provided address but WE DO NOT STORE IT.
      The data is immediately returned to the caller.
    */
    const { pollingLocations, earlyVoteSites, contests, state } = response.data;

    return {
      pollingLocations: pollingLocations || [],
      earlyVoteSites: earlyVoteSites || [],
      contests: contests || [],
      state: state || [],
    };
  } catch (error) {
    if (error instanceof CivicApiError) throw error;
    
    throw new CivicApiError('Failed to fetch voter information. Please check the address.', error.response?.status || 500);
  }
};

module.exports = {
  getElections,
  getVoterInfo,
};
