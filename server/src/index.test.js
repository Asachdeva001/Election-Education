/**
 * @file index.test.js
 * @description End-to-End integration tests for the Express Server.
 * Verifies application boot, security headers, and health endpoint.
 */

// --- Imports ---
const request = require('supertest');
const app = require('./index'); // Express application

// --- Mocks ---
// We mock the DB initialization to prevent true connections during basic routing tests
jest.mock('./db/postgres', () => ({
  initializeDb: jest.fn().mockResolvedValue(true),
  getPool: jest.fn().mockReturnValue({
    connect: jest.fn().mockResolvedValue({
      query: jest.fn(),
      release: jest.fn()
    })
  })
}));

// --- Test Suite ---
describe('Express Server E2E', () => {
  
  it('should respond to /health with 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('OK');
    expect(res.body.message).toEqual('Election Server is running.');
  });
  
  it('should have Helmet security headers actively applied', async () => {
    const res = await request(app).get('/health');
    // Verify some of the core headers Helmet applies
    expect(res.headers['x-dns-prefetch-control']).toBeDefined();
    expect(res.headers['x-frame-options']).toBeDefined();
    expect(res.headers['x-content-type-options']).toEqual('nosniff');
  });

  it('should return 404 for unknown API routes to trigger the global error handler correctly', async () => {
    const res = await request(app).get('/api/unknown-endpoint');
    // Express default for unhandled route is 404 HTML, but here we expect the fallback 
    // to either handle it or return a default response depending on setup.
    // Given the '*' fallback returns index.html, testing API namespace misses specifically.
    expect(res.statusCode).toEqual(404);
  });
});
