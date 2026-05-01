/**
 * @file errors.js
 * @description Defines custom error classes for the Election Server.
 */

// --- Custom Errors ---

/**
 * Standardized API Error for external service failures.
 * Ensures we don't leak stack traces or unwanted provider information to the client.
 */
class CivicApiError extends Error {
  /**
   * Creates a new CivicApiError.
   * @param {string} message - The error message.
   * @param {number} [status=500] - The HTTP status code.
   */
  constructor(message, status = 500) {
    super(message);
    this.name = 'CivicApiError';
    this.status = status;
  }
}

// --- Exports ---
module.exports = {
  CivicApiError,
};
