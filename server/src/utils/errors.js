/**
 * Standardized API Error for external service failures.
 * Ensures we don't leak stack traces or unwanted provider information to the client.
 */
class CivicApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'CivicApiError';
    this.status = status;
  }
}

module.exports = {
  CivicApiError,
};
