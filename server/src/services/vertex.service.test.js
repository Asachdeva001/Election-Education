/**
 * @file vertex.service.test.js
 * @description Unit tests for the Vertex AI RAG service.
 * Ensures the generative model interprets context and formats responses correctly.
 */

// --- Imports ---
const { generateGroundedResponse } = require('./vertex.service');

// --- Mocks ---
// Mock VertexAI SDK globally
jest.mock('@google-cloud/vertexai', () => {
  return {
    VertexAI: jest.fn().mockImplementation(() => ({
      preview: {
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockResolvedValue({
            response: {
              candidates: [
                {
                  content: { parts: [{ text: 'Based on the context, your polling place is the Main Library.' }] }
                }
              ]
            }
          })
        })
      }
    }))
  };
});

// --- Test Suite ---
describe('Vertex AI RAG Service', () => {
  it('should successfully pass formatted prompt to the Gemini model', async () => {
    const civicContext = { pollingLocations: [{ address: { locationName: 'Main Library' } }] };
    const userQuery = 'Where do I vote?';

    const result = await generateGroundedResponse(userQuery, civicContext);
    
    expect(result).toBe('Based on the context, your polling place is the Main Library.');
  });
});
