import { isTravelQuestion, retrieveDocuments } from '../../server/knowledge.js'

type GroqResponse = {
  choices?: Array<{ message?: { content?: string } }>
}

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed.' }, { status: 405 })
  }

  let body: { question?: unknown }
  try {
    body = await request.json() as { question?: unknown }
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const question = typeof body.question === 'string' ? body.question.trim() : ''
  if (!question) {
    return Response.json({ error: 'Please ask a travel question.' }, { status: 400 })
  }

  if (!isTravelQuestion(question)) {
    return Response.json({
      answer: 'I’m focused on travel only. Ask me about destinations, itineraries, transport, food, visas, or trip planning.',
      sources: [],
      refused: true,
    })
  }

  const groqApiKey = process.env.GROQ_API_KEY
  if (!groqApiKey) {
    return Response.json({ error: 'The travel API is not configured on Netlify. Add GROQ_API_KEY in Site configuration > Environment variables, then redeploy.' }, { status: 503 })
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
      console.error('Groq error:', await groqResponse.text())
      return Response.json({ error: 'Groq could not answer right now. Please try again.' }, { status: 502 })
    }

    const data = await groqResponse.json() as GroqResponse
    const answer = data.choices?.[0]?.message?.content?.trim()
    if (!answer) {
      return Response.json({ error: 'The model returned an empty answer. Please try again.' }, { status: 502 })
    }

    return Response.json({
      answer,
      sources: sources.map(({ id, title, region }) => ({ id, title, region })),
      refused: false,
    })
  } catch (error) {
    console.error('Chat request failed:', error)
    return Response.json({ error: 'Unable to reach Groq right now. Please try again.' }, { status: 500 })
  }
}
