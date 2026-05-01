/**
 * @file dialogflow.controller.js
 * @description Controllers for handling webhooks from Dialogflow CX.
 * Orchestrates Retrieval-Augmented Generation (RAG) using Civic Info and Vertex AI.
 */

// --- Imports ---
const { generateGroundedResponse } = require('../services/vertex.service');
const civicInfoService = require('../services/civicInfo.service');
const { CivicApiError } = require('../utils/errors');

// --- Controllers ---

/**
 * Handles incoming Fulfillment Webhooks from Dialogflow CX.
 * Authenticates the request and processes RAG-enabled intents.
 * 
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 */
const handleWebhook = async (req, res, next) => {
  try {
    // 1. Webhook Security Verification
    const authHeader = req.headers['authorization'];
    if (process.env.NODE_ENV !== 'test' && authHeader !== `Bearer ${process.env.DIALOGFLOW_WEBHOOK_SECRET}`) {
      throw new CivicApiError('Unauthorized Dialogflow Webhook', 401);
    }

    // 2. Parse Dialogflow CX standard payload
    const dialogflowRequest = req.body;
    const tag = dialogflowRequest.fulfillmentInfo?.tag; 
    const sessionInfo = dialogflowRequest.sessionInfo || {};
    const parameters = sessionInfo.parameters || {};

    const userQuery = dialogflowRequest.text; // The original question
    let fulfillmentResponseText = "I encountered an error processing your query.";

    // 3. RAG Orchestration based on Tag
    if (tag === 'RAG_FALLBACK' || tag === 'VOTER_INFO_QUERY') {
      const address = parameters.address || parameters.zip_code;
      
      if (!address) {
        fulfillmentResponseText = "I need your zip code or address to look up that specific local information. Could you provide it?";
      } else {
        try {
           // Retrieval: Get grounding data
           const civicContext = await civicInfoService.getVoterInfo(address);

           // Augmented Generation: Ask Gemini
           fulfillmentResponseText = await generateGroundedResponse(userQuery, civicContext);
        } catch (civicErr) {
           console.error("Civic lookup failed during RAG:", civicErr.message);
           fulfillmentResponseText = "I couldn't find official data for that address. Please check your local state portal directly.";
        }
      }
    } else {
      fulfillmentResponseText = "This endpoint only processes RAG-enabled intents currently.";
    }

    // 4. Respond in Dialogflow CX native format
    res.json({
      fulfillmentResponse: {
        messages: [{
          text: {
            text: [fulfillmentResponseText]
          }
        }]
      }
    });

  } catch (error) {
    next(error);
  }
};

// --- Exports ---
module.exports = {
  handleWebhook,
};
