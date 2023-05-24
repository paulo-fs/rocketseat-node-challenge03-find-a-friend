import request from 'supertest'
import { app } from '@/app'
import { describe, beforeAll, afterAll, expect, it } from 'vitest'

describe('Pet profile e2e', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to view a pet profile', async () => {
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

        const newPet = await request(app.server).post('/pet')
            .send({
                name: 'doguinho',
                age: 1,
                race: 'dalmata',
                details: 'detalhes do doguinho',
                ongEmail: 'teste@example.com'
            })
            .set('Authorization', `Bearer ${login.body.token}`)

        const response = await request(app.server).get(`/pet/${newPet.body.id}`)

        expect(response.status).toBe(200)
        expect(response.body.pet).toContain({
            name: 'doguinho',
        })
        expect(response.body.pet.ong).toContain({
            email: 'teste@example.com',
            whatsapp: '35999783000'
        })
    })
})
