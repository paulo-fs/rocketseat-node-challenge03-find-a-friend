import request from 'supertest'
import { app } from '@/app'
import { describe, beforeAll, afterAll, expect, it } from 'vitest'

describe('Register pet e2e', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able register a pet', async () => {
        await request(app.server).post('/ong').send({
            name: 'ong test',
            email: 'teste@example.com',
            password: '123456',
            whatsapp: '35999783000',
            city: 'pouso alegre',
            cep: '37550000',
            street: 'teste'
        })

        const login = await request(app.server).post('/session').send({
            email: 'teste@example.com',
            password: '123456',
        })

        const response = await request(app.server).post('/pet')
            .send({
                name: 'doguinho',
                age: 2,
                race: 'vira lata',
                details: 'detalhes do doguinho',
                ongEmail: 'teste@example.com'
            })
            .set('Authorization', `Bearer ${login.body.token}`)

        expect(response.statusCode).toEqual(200)
        expect(response.body).toContain({
            name: 'doguinho'
        })
    })
})
