import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { ListPetUseCase } from './list-pets'
import { OngsRepository } from '@/repositories/ongs-repository'
import { InMemoryOngsRepository } from '@/repositories/in-memory/in-memory-ongs-repository'
import { hash } from 'bcryptjs'
import { CityNotInformedError } from './errors/city-not-informed-error'
import { PetsRepository } from '@/repositories/pets-repository'

let ongsRepository: OngsRepository
let petsRepository: PetsRepository
let sut: ListPetUseCase

describe('List Pets use case', () => {
    beforeEach(() => {
        ongsRepository = new InMemoryOngsRepository()
        petsRepository = new InMemoryPetsRepository()
        sut = new ListPetUseCase(petsRepository, ongsRepository)
    })

    it('should be able to list pets by city', async () => {
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

        await petsRepository.create({
            name: 'doguinho',
            age: 2,
            details: 'detalhes...',
            race: 'vira lata',
            ong_id: id
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

    it('should be able paginate pets list', async () => {
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

        for (let i = 1; i <= 22; i++) {
            await petsRepository.create({
                name: `doguinho ${i}`,
                age: 2,
                details: 'detalhes...',
                race: 'vira lata',
                ong_id: id
            })
        }

        const { pets } = await sut.execute({ city, page: '2' })
        expect(pets).toHaveLength(2)
    })
})
