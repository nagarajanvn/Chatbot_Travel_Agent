# Wayfarer workspace instructions

- Keep Groq credentials in `.env`; never commit secrets.
- Preserve the travel-only scope gate in `server/index.ts`.
- Keep answers grounded in the local retrieval corpus and expose retrieved sources in API responses.
