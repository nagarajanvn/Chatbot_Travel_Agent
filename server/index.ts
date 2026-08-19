import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { isTravelQuestion, retrieveDocuments } from './knowledge.js'

const app = express()
const port = Number(process.env.PORT ?? 8787)
const groqApiKey = process.env.GROQ_API_KEY

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, configured: Boolean(groqApiKey) })
})

app.post('/api/chat', async (request, response) => {
  const question = typeof request.body?.question === 'string' ? request.body.question.trim() : ''
  if (!question) {
    return response.status(400).json({ error: 'Please ask a travel question.' })
  }

  if (!isTravelQuestion(question)) {
    return response.json({
      answer: 'I’m focused on travel only. Ask me about destinations, itineraries, transport, food, visas, or trip planning.',
      sources: [],
      refused: true,
    })
  }

  if (!groqApiKey) {
    return response.status(503).json({ error: 'GROQ_API_KEY is not configured. Add it to your .env file and restart the server.' })
  }

  const sources = retrieveDocuments(question)
  const context = sources.length > 0
    ? sources.map((source) => `[${source.title}] ${source.content}`).join('\n\n')
    : 'No matching destination note was found. Answer with general travel guidance, clearly flagging details that can change and suggesting the traveler verify current official sources.'

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        temperature: 0.25,
        max_tokens: 500,
        messages: [
          {
            role: 'system',
            content: 'You are Wayfarer, a travel information assistant. Answer ONLY travel-related questions. Use the retrieved notes as your primary grounding. If the notes do not contain the answer, say what is uncertain and recommend checking current official sources for live information such as visa rules, prices, schedules, weather, and safety. Never invent citations, never answer unrelated questions, and keep responses practical and concise.',
          },
          {
            role: 'user',
            content: `Retrieved travel notes:\n${context}\n\nTraveler question: ${question}`,
          },
        ],
      }),
    })

    if (!groqResponse.ok) {
      const details = await groqResponse.text()
      console.error('Groq error:', details)
      return response.status(502).json({ error: 'Groq could not answer right now. Please try again.' })
    }

    const data = await groqResponse.json() as { choices?: Array<{ message?: { content?: string } }> }
    const answer = data.choices?.[0]?.message?.content?.trim()
    if (!answer) {
      return response.status(502).json({ error: 'The model returned an empty answer. Please try again.' })
    }

    return response.json({
      answer,
      sources: sources.map(({ id, title, region }) => ({ id, title, region })),
      refused: false,
    })
  } catch (error) {
    console.error('Chat request failed:', error)
    return response.status(500).json({ error: 'Unable to reach Groq right now. Please try again.' })
  }
})

app.listen(port, () => {
  console.log(`Wayfarer API listening on http://localhost:${port}`)
})
