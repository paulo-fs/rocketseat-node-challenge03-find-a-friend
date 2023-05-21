import request from 'supertest'
import { app } from '@/app'
import { describe, beforeAll, afterAll, expect, it } from 'vitest'

describe('Ong profile e2e', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to view profile if authenticated', async () => {
        await request(app.server).post('/ong').send({
            name: 'ong test',
            email: 'teste@example.com',
            password: '123456',
            whatsapp: '35999783000',
            city: 'pouso alegre',
            cep: '37550000',
            street: 'teste'
        })

        const response = await request(app.server).post('/session').send({
            email: 'teste@example.com',
            password: '123456',
        })

        const profile = await request(app.server).get('/me')
            .set('Authorization', `Bearer ${response.body.token}`)

        expect(profile.statusCode).toEqual(200)
        expect(profile.body.ong).toContain({ name: 'ong test'})
    })
})
