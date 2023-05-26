import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'
import { verifyJWT } from './middlewares/verify-jwt'
import { ongProfile } from './controllers/ong-profile'
import { registerPet } from './controllers/register-pet'
import { filterPets } from './controllers/filter-pets'
import { petProfile } from './controllers/pet-profile'
import { adoptAPet } from './controllers/adoptAPet'
import { refresh } from './controllers/refresh'

export async function appRoutes(app: FastifyInstance) {
    app.post('/ong', register)
    app.get('/pet', filterPets)
    app.get('/pet/:id', petProfile)
    app.post('/adopt', adoptAPet)

    // Authentication
    app.post('/session', authenticate)
    app.patch('/token/refresh', refresh)

    // Authenticated
    app.get('/me', { onRequest: [verifyJWT] }, ongProfile)
    app.post('/pet', { onRequest: [verifyJWT] }, registerPet)
}
