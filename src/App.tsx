import { FormEvent, useState } from 'react'
import { ArrowUpRight, Building2, Compass, ExternalLink, MapPin, MessageCircle, Sparkles, WalletCards } from 'lucide-react'

type Source = { id: string; title: string; region: string }
type Message = { role: 'user' | 'assistant'; content: string; sources?: Source[]; refused?: boolean }

const suggestions = [
  'Build a 5-day Rajasthan itinerary',
  'Best places to stay in Kerala under ₹5,000?',
  'When is the best time to visit Goa?',
]

const indiaDestinations = [
  { name: 'Delhi', region: 'North', note: 'History & street food', top: '21%', left: '53%' },
  { name: 'Jaipur', region: 'Northwest', note: 'Forts & heritage', top: '29%', left: '38%' },
  { name: 'Mumbai', region: 'West', note: 'Coast & culture', top: '54%', left: '31%' },
  { name: 'Goa', region: 'West', note: 'Beaches & slow days', top: '70%', left: '36%' },
  { name: 'Kochi', region: 'South', note: 'Backwaters & spice', top: '82%', left: '48%' },
  { name: 'Kolkata', region: 'East', note: 'Art & old-world charm', top: '45%', left: '76%' },
]

const bookingSites = [
  { name: 'Booking.com', detail: 'Large choice with flexible filters and guest reviews.', url: 'https://www.booking.com' },
  { name: 'MakeMyTrip', detail: 'Strong India coverage, trains, hotels, and frequent deals.', url: 'https://www.makemytrip.com' },
  { name: 'Goibibo', detail: 'Useful for comparing domestic stays and member offers.', url: 'https://www.goibibo.com' },
  { name: 'Agoda', detail: 'Often competitive for city hotels and advance bookings.', url: 'https://www.agoda.com' },
  { name: 'Cleartrip', detail: 'Simple hotel search with an India-first travel workflow.', url: 'https://www.cleartrip.com' },
]

function App() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState('Jaipur')

  async function ask(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    setQuestion('')
    setMessages((current) => [...current, { role: 'user', content: trimmed }])
    setLoading(true)
    try {
      const result = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
      })
      const data = await result.json() as { answer?: string; error?: string; sources?: Source[]; refused?: boolean }
      setMessages((current) => [...current, {
        role: 'assistant',
        content: data.answer ?? data.error ?? 'Something went wrong. Please try again.',
        sources: data.sources,
        refused: data.refused,
      }])
    } catch {
      setMessages((current) => [...current, { role: 'assistant', content: 'I can’t reach the travel desk right now. Check that the API server is running and try again.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    void ask(question)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Wayfarer home">
          <span className="brand-mark"><Compass size={20} strokeWidth={2.4} /></span>
          <span>wayfarer</span>
        </a>
        <div className="header-note"><span className="status-dot" /> Travel intelligence, grounded in context</div>
      </header>

      <section className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={15} /> India, more considered</p>
          <h1>Find your way<br /><em>through India.</em></h1>
          <p className="hero-description">Thoughtful routes, local context, and comfortable stays that respect a daily budget of ₹5,000.</p>
          <div className="scope-pill"><span className="scope-icon"><MapPin size={15} /></span><span><strong>India travel desk</strong> · grounded in local notes</span></div>
        </div>
        <aside className="signal-panel">
          <div className="panel-topline"><span>FIELD NOTES / INDIA</span><span>RAG ACTIVE</span></div>
          <div className="map-art" aria-hidden="true">
            <div className="latitude latitude-one" /><div className="latitude latitude-two" /><div className="longitude longitude-one" /><div className="longitude longitude-two" />
            <span className="map-point point-one" /><span className="map-point point-two" /><span className="map-point point-three" />
            <span className="map-label label-one">EUROPE</span><span className="map-label label-two">ASIA</span><span className="map-label label-three">SOUTH AMERICA</span>
          </div>
          <div className="panel-footer"><span>Curated India destination notes</span><ArrowUpRight size={16} /></div>
        </aside>
      </section>

      <section className="india-section">
        <div className="section-heading"><div><p className="eyebrow">A country in many directions</p><h2>Start with a place.</h2></div><span className="budget-badge"><WalletCards size={15} /> ₹5,000 / day for stays</span></div>
        <div className="india-grid">
          <div className="india-map-card">
            <div className="india-map-heading"><span>INDIA / DESTINATION MAP</span><span>06 BASES</span></div>
            <div className="india-map" role="img" aria-label="Stylized map of India with destination markers">
              <svg className="india-silhouette" viewBox="0 0 360 440" aria-hidden="true"><path d="M126 20 173 36 207 30 230 49 273 58 286 85 307 101 292 128 313 151 299 177 313 206 294 229 300 263 278 284 267 320 242 335 230 371 211 396 192 419 176 391 154 373 137 338 117 317 94 294 78 263 61 246 66 219 47 198 59 173 45 151 66 133 57 106 76 86 82 58 103 47Z" /></svg>
              {indiaDestinations.map((destination) => <button className={`india-marker ${selectedDestination === destination.name ? 'active' : ''}`} style={{ top: destination.top, left: destination.left }} key={destination.name} type="button" onClick={() => setSelectedDestination(destination.name)}><span className="marker-dot" /><span>{destination.name}</span></button>)}
            </div>
            <div className="map-caption"><span><span className="legend-dot" /> Curated bases</span><span>Tap a marker to explore</span></div>
          </div>
          <div className="destination-list"><p className="eyebrow">Selected base</p><h3>{selectedDestination}</h3><p className="destination-note">{indiaDestinations.find((destination) => destination.name === selectedDestination)?.note}</p><button className="ask-destination" type="button" onClick={() => void ask(`Plan a budget-conscious trip to ${selectedDestination} in India`)}>Ask about {selectedDestination}<ArrowUpRight size={15} /></button><div className="destination-rule" /><p className="mini-label">Why start here?</p><p className="destination-copy">Use the map to choose a rhythm, then ask Wayfarer for routes, neighborhoods, local food, and stay ideas within your budget.</p></div>
        </div>
      </section>

      <section className="stay-section"><div className="section-heading"><div><p className="eyebrow">Stay within the lines</p><h2>Hotel hunting, made simpler.</h2></div><span className="message-count"><Building2 size={15} /> Compare before you book</span></div><div className="booking-grid">{bookingSites.map((site, index) => <a className="booking-card" href={site.url} target="_blank" rel="noreferrer" key={site.name}><span className="booking-index">0{index + 1}</span><span><strong>{site.name}</strong><small>{site.detail}</small></span><ExternalLink size={15} /></a>)}</div><p className="booking-tip"><WalletCards size={15} /> Set the filter to ₹5,000 or less, then check taxes, cancellation terms, location, and recent reviews. Rates vary by city and season.</p></section>

      <section className="chat-section">
        <div className="section-heading"><div><p className="eyebrow">Ask the wayfarer</p><h2>Where will curiosity take you?</h2></div><span className="message-count"><MessageCircle size={15} /> {messages.length ? `${messages.length} messages` : 'Start a conversation'}</span></div>
        <div className="chat-window">
          {messages.length === 0 ? (
            <div className="empty-state"><div className="empty-icon"><Compass size={25} /></div><h3>Tell me what you’re planning in India.</h3><p>Routes, seasons, food, trains, neighborhoods, and stays that fit your trip.</p></div>
          ) : (
            <div className="message-list">{messages.map((message, index) => <article className={`message ${message.role}`} key={`${message.role}-${index}`}><div className="message-avatar">{message.role === 'user' ? 'YOU' : 'W'}</div><div className="message-body"><div className="message-label">{message.role === 'user' ? 'You' : 'Wayfarer'}</div><p>{message.content}</p>{message.sources && message.sources.length > 0 && <div className="sources"><span>Retrieved from</span>{message.sources.map((source) => <span className="source-tag" key={source.id}><MapPin size={12} /> {source.title}</span>)}</div>}</div></article>)}</div>
          )}
          {loading && <div className="typing"><span className="message-avatar">W</span><span><i /><i /><i /></span></div>}
        </div>
        <form className="composer" onSubmit={handleSubmit}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about travelling in India..." aria-label="India travel question" /><button type="submit" disabled={loading || !question.trim()} aria-label="Send question"><ArrowUpRight size={20} /></button></form>
        <div className="suggestions">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => void ask(suggestion)}>{suggestion}<ArrowUpRight size={14} /></button>)}</div>
      </section>
      <footer><span>WAYFARER / INDIA TRAVEL KNOWLEDGE SYSTEM</span><span>Built for better departures</span></footer>
    </main>
  )
}

export default App
