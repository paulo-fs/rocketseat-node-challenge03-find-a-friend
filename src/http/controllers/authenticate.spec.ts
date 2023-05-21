import request from 'supertest'
import { app } from '@/app'
import { describe, beforeAll, afterAll, expect, it } from 'vitest'


describe('Authenticate e2e', async () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to register an ong', async () => {
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

        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual({
            token: expect.any(String)
        })
    })
})
