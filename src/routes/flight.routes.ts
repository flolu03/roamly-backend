import { FastifyPluginAsync } from 'fastify'
import axios from 'axios'
import { searchFlights } from '../services/flight.service'

const flightRoutes: FastifyPluginAsync = async (server) => {
  server.get('/places/search', async (request, reply) => {
    const { query } = request.query as { query: string }
    if (!query || query.length < 2) return reply.send({ data: [] })

    try {
      const res = await axios.get('https://api.duffel.com/places/suggestions', {
        params: { query },
        headers: {
          Authorization: `Bearer ${process.env.DUFFEL_API_KEY}`,
          'Duffel-Version': 'v2',
          Accept: 'application/json',
        },
      })
      return reply.send(res.data)
    } catch (err: any) {
      return reply.status(500).send({ data: [] })
    }
  })

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

    const paxCount = parseInt(pax) || 1

    try {
      const flights = await searchFlights(origin, destination, date, paxCount)
      return reply.send({ flights })
    } catch (err: any) {
      request.log.error(err)
      return reply.status(500).send({ error: 'Flugsuche fehlgeschlagen', details: err.message })
    }
  })
}

export default flightRoutes
