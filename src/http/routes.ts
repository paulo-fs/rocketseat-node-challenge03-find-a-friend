import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'
import { verifyJWT } from './middlewares/verify-jwt'
import { ongProfile } from './controllers/ong-profile'
import { registerPet } from './controllers/register-pet'
import { listPets } from './controllers/list-pets'

export async function appRoutes(app: FastifyInstance) {
    app.post('/ong', register)
    app.post('/session', authenticate)
    app.get('/pet', listPets)

    // Authenticated
    app.get('/me', { onRequest: [verifyJWT] }, ongProfile)
    app.post('/pet', { onRequest: [verifyJWT] }, registerPet)
}
