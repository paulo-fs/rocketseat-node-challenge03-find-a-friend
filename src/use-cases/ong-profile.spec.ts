import { OngsRepository } from '@/repositories/ongs-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { OngProfileUseCase } from './ong-profile'
import { InMemoryOngsRepository } from '@/repositories/in-memory/in-memory-ongs-repository'
import { hash } from 'bcryptjs'

let ongsRepository: OngsRepository
let sut: OngProfileUseCase

describe('Ong Profile use case', () => {
    beforeEach(() => {
        ongsRepository = new InMemoryOngsRepository()
        sut = new OngProfileUseCase(ongsRepository)
    })

    it('should be able to see ong profile', async () => {
        const ongEmail = 'testOng@mail.com'
        const city = 'Pouso Alegre'

        const { id } = await ongsRepository.create({
            name: 'ong test',
            email: ongEmail,
            password_hash: await hash('123456', 6),
            whatsapp: '35999783000',
            city: city,
            cep: '37550000'
        })

        const { ong } = await sut.execute({ id })

        expect(ong.email).toEqual(ongEmail)
    })
})
