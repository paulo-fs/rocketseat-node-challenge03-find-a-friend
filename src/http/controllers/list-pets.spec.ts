import request from 'supertest'
import { app } from '@/app'
import { describe, beforeAll, afterAll, expect, it } from 'vitest'

describe('List pets e2e', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to list pets', async () => {
        await request(app.server).post('/ong').send({
            name: 'ong test',
            email: 'teste@example.com',
            password: '123456',
            whatsapp: '35999783000',
            city: 'Pouso Alegre',
            cep: '37550000',
            street: 'teste'
        })

        const login = await request(app.server).post('/session').send({
            email: 'teste@example.com',
            password: '123456',
        })

        console.log('login >>>>', login.statusCode)

        await request(app.server).post('/pet')
            .send({
                name: 'doguinho',
                age: 2,
                race: 'vira lata',
                details: 'detalhes do doguinho',
                ongEmail: 'teste@example.com'
            })
            .set('Authorization', `Bearer ${login.body.token}`)

        await request(app.server).post('/pet')
            .send({
                name: 'doguinho',
                age: 2,
                race: 'vira lata',
                details: 'detalhes do doguinho',
                ongEmail: 'teste@example.com'
            })
            .set('Authorization', `Bearer ${login.body.token}`)

        const response = await request(app.server).get('/pet')
            .query({
                city: 'Pouso Alegre',
                page: 1
            })

        expect(response.statusCode).toEqual(200)
        expect(response.body.pets).toHaveLength(2)
    })
})
