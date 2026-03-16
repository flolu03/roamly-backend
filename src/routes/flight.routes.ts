import { FastifyPluginAsync } from 'fastify'
import { searchFlights } from '../services/flight.service'

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

    const flights = await searchFlights(origin, destination, date, parseInt(pax) || 1)
    return reply.send({ flights })
  })
}

export default flightRoutes