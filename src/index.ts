import Fastify from 'fastify'
import dotenv from 'dotenv'
import prismaPlugin from './plugins/prisma'
import authRoutes from './routes/auth.routes'
import flightRoutes from './routes/flight.routes'

dotenv.config()

const app = Fastify({ logger: true })

app.register(prismaPlugin)
app.register(authRoutes)
app.register(flightRoutes)

app.get('/health', async () => {
  return { status: 'ok', app: 'roamly-backend' }
})

app.listen({ port: 3000 }, (err) => {
  if (err) { app.log.error(err); process.exit(1) }
  console.log('Roamly Backend läuft auf :3000')
})
