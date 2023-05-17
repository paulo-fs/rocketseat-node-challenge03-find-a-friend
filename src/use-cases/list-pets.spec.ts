import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { ListPetUseCase } from './list-pets'
import { OngsRepository } from '@/repositories/ongs-repository'
import { InMemoryOngsRepository } from '@/repositories/in-memory/in-memory-ongs-repository'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { CityNotInformedError } from './errors/city-not-informed-error'

let ongsRepository: OngsRepository
let repository: InMemoryPetsRepository
let sut: ListPetUseCase

describe('List Pets use case', () => {
    beforeEach(() => {
        ongsRepository = new InMemoryOngsRepository()
        repository = new InMemoryPetsRepository()
        sut = new ListPetUseCase(repository)
    })

    it('should be able to list pets by city', async () => {
        const ongEmail = 'testOng@mail.com'
        const city = 'Pouso Alegre'
        const ongId = randomUUID()

        ongsRepository.create({
            id: ongId,
            name: 'ong test',
            email: ongEmail,
            password_hash: await hash('123456', 6),
            whatsapp: '35999783000',
            city: city,
            cep: '37550000'
        })

        repository.create({
            name: 'doguinho',
            age: 2,
            city: city,
            detais: 'detalhes...',
            race: 'vira lata',
            ong_id: ongId
        })

        const { pets } = await sut.execute({ city: city })
        expect(pets).toHaveLength(1)
    })

    it('should not be able to list pets without inform the city', async () => {
        await expect(() =>
            sut.execute({
                city: ''
            })
        ).rejects.toBeInstanceOf(CityNotInformedError)
    })
})
