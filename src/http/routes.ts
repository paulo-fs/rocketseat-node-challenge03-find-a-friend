import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'
import { verifyJWT } from './middlewares/verify-jwt'
import { ongProfile } from './controllers/ong-profile'
import { registerPet } from './controllers/register-pet'

export async function appRoutes(app: FastifyInstance) {
    app.post('/ong', register)
    app.post('/session', authenticate)

    // Authenticated
    app.get('/me', { onRequest: [verifyJWT] }, ongProfile)
    app.post('/pet', { onRequest: [verifyJWT] }, registerPet)
}
