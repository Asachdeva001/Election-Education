/**
 * @file vertex.service.js
 * @description Service for generating grounded AI responses using Google Vertex AI.
 * Implements strict constraints to answer queries based solely on provided civic context.
 */

// --- Imports ---
const { VertexAI } = require('@google-cloud/vertexai');

// --- State ---
let vertexAI;
let generativeModel;

// --- Helpers ---

/**
 * Initializes and retrieves the Gemini generative model.
 * 
 * @returns {Object|undefined} The generative model instance or undefined on failure.
 */
const getModel = () => {
  if (!generativeModel) {
    try {
      vertexAI = new VertexAI({
          project: process.env.GCP_PROJECT_ID || 'local-fallback-project',
          location: process.env.DIALOGFLOW_LOCATION || 'us-central1'
      });
      
      // Instantiate the chosen Gemini model
      generativeModel = vertexAI.preview.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.2, // Low temperature for factual, grounded responses
          topP: 0.8
        },
      });
    } catch (e) {
      console.warn('Vertex AI failed to initialize. RAG will fallback to mock testing.', e.message);
    }
  }
  return generativeModel;
};

// --- Services ---

/**
 * Executes a Retrieval-Augmented Generation prompt strictly bounded by Civic info context.
 * 
 * @param {string} userQuery - The question the user submitted to Dialogflow.
 * @param {Object} civicContext - The real-time JSON data from getVoterInfo().
 * @returns {Promise<string>} The generated safe response.
 */
const generateGroundedResponse = async (userQuery, civicContext) => {
  const model = getModel();

  if (!model) {
      return "I'm sorry, my AI connection is currently offline. Please refer directly to your local state portal.";
  }

  // Constraining System Prompt logic
  const prompt = `
  You are a non-partisan, strictly informational Election Assistant.
  Your task is to answer the user's query ONLY using the provided civic context below.
  If the context does not contain the answer, explicitly state: "I don't have enough local information to answer that. Please check your state's official election website."
  DO NOT hallucinate or guess any election rules, deadlines, or polling locations.
  
  CIVIC CONTEXT:
  ${JSON.stringify(civicContext)}
  
  USER QUERY:
  ${userQuery}
  `;

  try {
    const request = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    };
    
    const streamingResp = await model.generateContent(request);
    const response = streamingResp.response;
    
    return response.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Vertex AI Generation Error:', error);
    return "I'm having trouble analyzing the official guidelines right now. Please try again later.";
  }
};

// --- Exports ---
module.exports = {
  generateGroundedResponse,
};
