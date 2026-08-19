# Wayfarer

A travel-only RAG chatbot powered by Groq. The backend retrieves relevant notes from `server/knowledge.ts`, injects them into a grounded prompt, and returns the answer with the notes used as sources.

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env
   ```

3. Add your Groq API key to `.env` as `GROQ_API_KEY`.

4. Start the frontend and API:

   ```bash
   npm run dev
   ```

   Open `http://localhost:5173`.

## Guardrails

- Questions are screened for travel intent before any model call.
- The system prompt instructs Groq to answer travel questions only.
- Retrieval uses the curated destination corpus in `server/knowledge.ts`.
- Live details such as visas, prices, schedules, weather, and safety are explicitly treated as changeable and should be checked with official sources.

## Checks

```bash
npm run typecheck
npm run build
```
