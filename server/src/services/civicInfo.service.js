/**
 * @file civicInfo.service.js
 * @description Service for interacting with the Google Civic Information API.
 * Fetches global elections and specific voter info with zero-PII storage compliance.
 */

// --- Imports ---
const axios = require('axios');
const { CivicApiError } = require('../utils/errors');

// --- Constants ---
const CIVIC_INFO_API_URL = 'https://civicinfo.googleapis.com/civicinfo/v2';

// --- Helpers ---

/**
 * Validates that the Civic Info API Key is present in the environment.
 * 
 * @returns {string} The API key.
 * @throws {CivicApiError} If the API key is missing.
 */
const getApiKey = () => {
  const key = process.env.CIVIC_INFO_API_KEY;
  if (!key) {
    throw new CivicApiError('Server Configuration Error: Missing Civic Info API Key.', 500);
  }
  return key;
};

// --- Services ---

/**
 * Fetches a list of upcoming elections from the Google Civic Information API.
 * 
 * @returns {Promise<Array>} List of upcoming elections.
 * @throws {CivicApiError} If the API request fails.
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
 * Zero-PII Compliance: We fetch using the address but do NOT store it.
 * 
 * @param {string} address - The residential address to query.
 * @param {number|string} [electionId] - Optional election ID.
 * @returns {Promise<Object>} Polling locations, early voting sites, and contest data.
 * @throws {CivicApiError} If the API request fails or address is missing.
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

// --- Exports ---
module.exports = {
  getElections,
  getVoterInfo,
};
