import { FastifyPluginAsync } from 'fastify'

const mockFlights = [
  { id: '1', airline: 'Lufthansa', airlineCode: 'LH', flightNumber: 'LH 760', departsAt: '09:15', arrivesAt: '22:45', duration: '11h 30m', stopsCount: 0, pricePerPax: 287, logoUrl: 'https://logos.skyscnr.com/images/airlines/favicon/LH.png', deepLink: 'https://www.skyscanner.de' },
  { id: '2', airline: 'Thai Airways', airlineCode: 'TG', flightNumber: 'TG 920', departsAt: '13:40', arrivesAt: '06:35', duration: '14h 55m', stopsCount: 1, pricePerPax: 241, logoUrl: 'https://logos.skyscnr.com/images/airlines/favicon/TG.png', deepLink: 'https://www.skyscanner.de' },
  { id: '3', airline: 'Emirates', airlineCode: 'EK', flightNumber: 'EK 048', departsAt: '21:30', arrivesAt: '12:15', duration: '13h 45m', stopsCount: 1, pricePerPax: 310, logoUrl: 'https://logos.skyscnr.com/images/airlines/favicon/EK.png', deepLink: 'https://www.skyscanner.de' },
  { id: '4', airline: 'Qatar Airways', airlineCode: 'QR', flightNumber: 'QR 067', departsAt: '14:20', arrivesAt: '08:30', duration: '12h 10m', stopsCount: 1, pricePerPax: 265, logoUrl: 'https://logos.skyscnr.com/images/airlines/favicon/QR.png', deepLink: 'https://www.skyscanner.de' },
  { id: '5', airline: 'Singapore Airlines', airlineCode: 'SQ', flightNumber: 'SQ 025', departsAt: '11:05', arrivesAt: '06:20', duration: '13h 15m', stopsCount: 1, pricePerPax: 298, logoUrl: 'https://logos.skyscnr.com/images/airlines/favicon/SQ.png', deepLink: 'https://www.skyscanner.de' },
]

const flightRoutes: FastifyPluginAsync = async (server) => {
  server.get('/flight/search', async (request, reply) => {
    const { origin, destination, date, pax } = request.query as {
      origin: string
      destination: string
      date: string
      pax: string
    }

    if (!origin || !destination || !date) {
      return reply.status(400).send({ error: 'origin, destination und date sind erforderlich' })
    }

    await new Promise(r => setTimeout(r, 600))

    const paxCount = parseInt(pax) || 1
    const flights = mockFlights.map(f => ({
      ...f,
      totalPrice: f.pricePerPax * paxCount,
      origin,
      destination,
      date
    }))

    return reply.send({ flights })
  })
}

export default flightRoutes
