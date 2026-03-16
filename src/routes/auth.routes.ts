import { FastifyPluginAsync } from 'fastify'
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from '../services/auth.service'

const authRoutes: FastifyPluginAsync = async (server) => {

  // Registrierung
  server.post('/auth/register', async (request, reply) => {
    const { email, password, displayName } = request.body as {
      email: string
      password: string
      displayName: string
    }

    const existing = await server.prisma.user.findUnique({ where: { email } })
    if (existing) {
      return reply.status(400).send({ error: 'E-Mail bereits vergeben' })
    }

    const passwordHash = await hashPassword(password)
    const user = await server.prisma.user.create({
      data: { email, passwordHash, displayName }
    })

    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    await server.prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    })

    return reply.status(201).send({
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, displayName: user.displayName }
    })
  })

  // Login
  server.post('/auth/login', async (request, reply) => {
    const { email, password } = request.body as {
      email: string
      password: string
    }

    const user = await server.prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash) {
      return reply.status(401).send({ error: 'E-Mail oder Passwort falsch' })
    }

    const valid = await comparePassword(password, user.passwordHash)
    if (!valid) {
      return reply.status(401).send({ error: 'E-Mail oder Passwort falsch' })
    }

    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    await server.prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    })

    return reply.send({
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, displayName: user.displayName }
    })
  })

  // Logout
  server.post('/auth/logout', async (request, reply) => {
    const { refreshToken } = request.body as { refreshToken: string }

    await server.prisma.session.deleteMany({ where: { refreshToken } })

    return reply.send({ message: 'Erfolgreich ausgeloggt' })
  })

}

export default authRoutes