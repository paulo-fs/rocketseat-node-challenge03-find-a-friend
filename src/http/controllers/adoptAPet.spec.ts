import request from 'supertest'
import { app } from '@/app'
import { describe, beforeAll, afterAll, expect, it } from 'vitest'

describe('Adopt a pet e2e', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able adopt a pet', async () => {
        await request(app.server).post('/ong').send({
            name: 'ong test',
            email: 'teste@example.com',
            password: '123456',
            whatsapp: '35999783000',
            city: 'pouso alegre',
            cep: '37550000',
            street: 'teste',
            role: 'ADMIN'
        })

        const login = await request(app.server).post('/session').send({
            email: 'teste@example.com',
            password: '123456',
        })

        const newPet = await request(app.server).post('/pet')
            .send({
                name: 'doguinho',
                age: 1,
                race: 'dalmata',
                details: 'detalhes do doguinho',
                ongEmail: 'teste@example.com'
            })
            .set('Authorization', `Bearer ${login.body.token}`)

        const response = await request(app.server).post('/adopt')
            .send({
                id: newPet.body.id
            })
            .set('Authorization', `Bearer ${login.body.token}`)

        expect(response.status).toBe(201)
        expect(response.body.message).toEqual('Pet adopted succesfully.')
    })
})
