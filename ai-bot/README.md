# Election Assistant AI Bot Configuration

This directory contains the foundational settings, intent schema, and automatic deployment architecture for the **Dialogflow CX** instance.

## Tone Selection Feature
Dialogflow CX responds primarily based on predefined text responses OR dynamically generated webhook responses. Since the user can configure their preferred tone directly in our application UI, the backend (`server/`) will intercept Dialogflow's webhook responses before returning them to the user, allowing us to actively wrap and re-prompt responses against Gemini/Vertex AI for stylistic mapping (Formal vs. Friendly).

## Automated Deployment to Google Cloud

To run the Dialogflow CX intent initializer programmatically into your Google Cloud project natively:

1. **Prerequisites in `.env`:**
   ```bash
   GCP_PROJECT_ID="your-project-id"
   DIALOGFLOW_AGENT_ID="your-agent-id"  # Retrieve this from the Dialogflow CX Console URL after creating a blank agent
   DIALOGFLOW_LOCATION="us-central1"
   ```
2. **Execute Deployment:**
   ```bash
   npm run deploy
   ```

## Included Intents
*   `faq.voter_id_requirements`: Photo ID logic.
*   `faq.absentee_voting`: Mail-in and out of state handling.
*   `faq.registration_status`: Checking and updating voter credentials.
