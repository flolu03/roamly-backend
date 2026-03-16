// src/index.ts
import Fastify from 'fastify'

const app = Fastify({ logger: true })

app.get('/health', async () => {
  return { status: 'ok', app: 'roamly-backend' }
})

app.listen({ port: 3000 }, (err) => {
  if (err) { app.log.error(err); process.exit(1) }
  console.log('Roamly Backend läuft auf :3000')
})