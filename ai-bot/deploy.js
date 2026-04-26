require('dotenv').config();
const { IntentsClient } = require('@google-cloud/dialogflow-cx');
const fs = require('fs');
const path = require('path');

// Verify GCP environment variables are loaded
const LOCATION = process.env.DIALOGFLOW_LOCATION || 'us-central1';
const PROJECT_ID = process.env.GCP_PROJECT_ID;
const AGENT_ID = process.env.DIALOGFLOW_AGENT_ID;

if (!PROJECT_ID || !AGENT_ID) {
  console.error("Please ensure GCP_PROJECT_ID and DIALOGFLOW_AGENT_ID are in your .env");
  process.exit(1);
}

const client = new IntentsClient({
    apiEndpoint: `${LOCATION}-dialogflow.googleapis.com`
});

const parent = `projects/${PROJECT_ID}/locations/${LOCATION}/agents/${AGENT_ID}`;

async function deployIntents() {
  const intentsDir = path.join(__dirname, 'intents');
  const files = fs.readdirSync(intentsDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const rawData = fs.readFileSync(path.join(intentsDir, file), 'utf-8');
    const intentPayload = JSON.parse(rawData);

    // Format training phrases for the CX SDK
    const trainingPhrases = intentPayload.trainingPhrases.map(phrase => ({
      parts: phrase.parts.map(part => ({ text: part.text })),
      repeatCount: 1,
      id: ''
    }));

    const intent = {
      displayName: intentPayload.displayName,
      trainingPhrases: trainingPhrases,
    };

    console.log(`Creating/Updating intent: ${intent.displayName}...`);

    try {
      // Create request
      const request = {
        parent,
        intent,
      };

      const [createdIntent] = await client.createIntent(request);
      console.log(`Successfully deployed: ${createdIntent.name}`);
    } catch (e) {
      console.error(`Failed to handle ${intent.displayName}:`, e.details || e.message);
    }
  }

  console.log("All intents processed. RAG Fallback routing pages should be configured in the CX Console visually.");
}

deployIntents().catch(console.error);
