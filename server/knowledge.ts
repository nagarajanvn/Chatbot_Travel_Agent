export type TravelDocument = {
  id: string
  title: string
  region: string
  content: string
  tags: string[]
}

export const travelDocuments: TravelDocument[] = [
  {
    id: 'india-budget',
    title: 'India budget travel',
    region: 'India',
    tags: ['india', 'budget', 'hotel', 'rupees', 'rail', 'itinerary'],
    content: 'A daily accommodation budget of around INR 5,000 works well for comfortable guesthouses, reliable 3-star hotels, and simple boutique stays in many Indian cities. Prices rise during festivals and peak seasons, so compare total prices including taxes and check recent guest reviews. Indian Railways connects major cities, while domestic flights save time across long distances. Carry small cash for local transport and markets, and use official tourism or transport sites for current rules and schedules.',
  },
  {
    id: 'jaipur',
    title: 'Jaipur, Rajasthan',
    region: 'India',
    tags: ['jaipur', 'rajasthan', 'india', 'forts', 'heritage', 'food'],
    content: 'Jaipur is a strong two- or three-day base for Amber Fort, the City Palace, Hawa Mahal, and colorful local markets. October through March is generally the most comfortable season for sightseeing. Start outdoor visits early, use app-based taxis or a pre-agreed auto-rickshaw fare, and leave room in the budget for a guided fort visit and a rooftop dinner.',
  },
  {
    id: 'kerala',
    title: 'Kerala, India',
    region: 'India',
    tags: ['kerala', 'india', 'backwaters', 'beach', 'nature', 'kochi'],
    content: 'Kerala combines Kochi heritage, the backwaters around Alappuzha, and hill country near Munnar. November through February is usually pleasant for a first visit, while monsoon months bring lush scenery and different travel conditions. For a 5,000-rupee daily hotel budget, compare stays in Fort Kochi and Alappuzha and book backwater transport directly with established operators.',
  },
  {
    id: 'goa',
    title: 'Goa, India',
    region: 'India',
    tags: ['goa', 'india', 'beach', 'seafood', 'relaxation'],
    content: 'Goa works best when you choose one base: North Goa for more nightlife and activity, or South Goa for a quieter beach stay. November through February is popular and hotel rates can rise around holidays. Renting a scooter requires the correct license and confidence in local traffic; taxis or drivers are better for longer day trips. Ask hotels about beach access, power backup, and airport transfer costs.',
  },
  {
    id: 'lisbon',
    title: 'Lisbon, Portugal',
    region: 'Europe',
    tags: ['lisbon', 'portugal', 'europe', 'city break', 'food', 'tram'],
    content: 'Lisbon is best explored by neighborhood: Alfama for steep lanes and fado, Baixa for grand squares, and Belém for riverside monuments. Ride tram 28 early in the morning to avoid the busiest crowds. The city has a mild, sunny climate; spring and early autumn are comfortable for walking. Portuguese is the official language and the euro is used. Keep a rechargeable transit card handy for trams, metro, and buses.',
  },
  {
    id: 'kyoto',
    title: 'Kyoto, Japan',
    region: 'Asia',
    tags: ['kyoto', 'japan', 'asia', 'temples', 'culture', 'rail'],
    content: 'Kyoto rewards slow mornings. Visit Fushimi Inari before 8am, then explore Higashiyama on foot. Arashiyama is quieter on its northern paths away from the bamboo grove. The best seasons for gardens and temples are spring and autumn, though both can be busy. Japan uses the yen. IC cards are convenient for local transit, while a reserved seat is useful for long-distance trains. Bowing lightly and removing shoes where requested are appreciated customs.',
  },
  {
    id: 'patagonia',
    title: 'Patagonia, Chile & Argentina',
    region: 'South America',
    tags: ['patagonia', 'chile', 'argentina', 'hiking', 'nature', 'trekking'],
    content: 'Patagonia has rapidly changing weather, strong winds, and large distances between trailheads. The main hiking season is roughly November through March, but shoulder-season conditions can be unpredictable. Torres del Paine and Los Glaciares require planning for park transport and, on popular multi-day routes, accommodation reservations. Pack waterproof layers, sun protection, and a refillable water bottle. Chilean pesos and Argentine pesos are used on their respective sides, and card acceptance varies outside towns.',
  },
  {
    id: 'marrakech',
    title: 'Marrakech, Morocco',
    region: 'Africa',
    tags: ['marrakech', 'morocco', 'africa', 'markets', 'desert', 'food'],
    content: 'Marrakech is a strong base for the medina, Atlas Mountains, and desert excursions. The medina is easiest to navigate with an offline map and a recognizable landmark because many alleys are pedestrian-only. Spring and autumn offer more comfortable daytime temperatures than midsummer. Morocco uses the dirham. Dress respectfully in residential areas and ask before photographing people. Agree on taxi fares in advance when the meter is not used.',
  },
  {
    id: 'new-york',
    title: 'New York City, USA',
    region: 'North America',
    tags: ['new york', 'usa', 'north america', 'museum', 'food', 'metro'],
    content: 'New York is organized around distinct neighborhoods, so grouping nearby sights saves time. The subway runs throughout Manhattan and into the outer boroughs; a contactless bank card or mobile wallet works at many turnstiles. Spring and autumn are comfortable for walking, while summer is hot and humid. The US dollar is used. Restaurant bills generally require an additional tip, and reservations are useful for popular dining rooms.',
  },
  {
    id: 'bali',
    title: 'Bali, Indonesia',
    region: 'Asia',
    tags: ['bali', 'indonesia', 'asia', 'beach', 'temple', 'wellness'],
    content: 'Bali has different travel rhythms: Ubud is known for arts and rice terraces, the south coast for beaches and nightlife, and the east and north for quieter scenery. The dry season is generally April through October, though rain can occur year-round. Indonesia uses the rupiah. Scooter travel requires the correct license and confidence in local traffic; a driver is often a calmer option for day trips. Cover shoulders and knees at temples and follow local ceremony restrictions.',
  },
]

const stopWords = new Set(['a', 'an', 'and', 'are', 'for', 'how', 'i', 'in', 'is', 'of', 'the', 'to', 'travel', 'what', 'where', 'when', 'with'])

export function retrieveDocuments(query: string, limit = 3) {
  const terms = query.toLowerCase().match(/[a-z0-9]+/g)?.filter((term) => term.length > 2 && !stopWords.has(term)) ?? []
  return travelDocuments
    .map((document) => {
      const haystack = `${document.title} ${document.region} ${document.tags.join(' ')} ${document.content}`.toLowerCase()
      const score = terms.reduce((total, term) => total + (haystack.includes(term) ? (document.tags.includes(term) ? 3 : 1) : 0), 0)
      return { document, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ document }) => document)
}

const travelSignals = ['airport', 'backpack', 'beach', 'border', 'city', 'country', 'destination', 'flight', 'food', 'hotel', 'itinerary', 'journey', 'luggage', 'museum', 'passport', 'plane', 'restaurant', 'resort', 'route', 'sightseeing', 'stay', 'temple', 'tour', 'train', 'trip', 'visa', '旅行', 'travel']

export function isTravelQuestion(query: string) {
  const words: string[] = query.toLowerCase().match(/[a-z0-9]+/g) ?? []
  return travelSignals.some((signal) => words.includes(signal)) || retrieveDocuments(query, 1).length > 0
}
