import { expect, describe, it, beforeEach } from 'vitest'
import { OngsRepository } from '@/repositories/ongs-repository'
import { PetsRepository } from '@/repositories/pets-repository'
import { FilterPetsUseCase } from './filter-pets'
import { InMemoryOngsRepository } from '@/repositories/in-memory/in-memory-ongs-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { randomUUID } from 'crypto'
import { hash } from 'bcryptjs'
import { CityNotInformedError } from './errors/city-not-informed-error'

let ongsRepository: OngsRepository
let petsRepository: PetsRepository
let sut: FilterPetsUseCase

describe('Filter Pets use case', () => {
    beforeEach(() => {
        ongsRepository = new InMemoryOngsRepository()
        petsRepository = new InMemoryPetsRepository()
        sut = new FilterPetsUseCase(petsRepository)
    })

    it('should be able to filter pets by race', async () => {
        const ongEmail = 'testOng@mail.com'
        const city = 'Pouso Alegre'
        const race = 'dalmata'
        const ongId = randomUUID()

        await ongsRepository.create({
            id: ongId,
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
            city: city,
            detais: 'detalhes...',
            race: race,
            ong_id: ongId
        })

        await petsRepository.create({
            name: 'doguinho',
            age: 2,
            city: city,
            detais: 'detalhes...',
            race: 'vira lata',
            ong_id: ongId
        })

        const { pets } = await sut.execute({ city, race })

        expect(pets[0]).toHaveProperty( 'race', race)
    })

    it('should be able to filter pets by race and age', async () => {
        const ongEmail = 'testOng@mail.com'
        const city = 'Pouso Alegre'
        const race = 'dalmata'
        const ongId = randomUUID()

        await ongsRepository.create({
            id: ongId,
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
            city: city,
            detais: 'detalhes...',
            race: race,
            ong_id: ongId
        })

        await petsRepository.create({
            name: 'doguinho',
            age: 1,
            city: city,
            detais: 'detalhes...',
            race: race,
            ong_id: ongId
        })

        await petsRepository.create({
            name: 'doguinho',
            age: 2,
            city: city,
            detais: 'detalhes...',
            race: 'vira lata',
            ong_id: ongId
        })

        const { pets } = await sut.execute({ city, race, age: 1 })

        expect(pets[0]).toHaveProperty( 'race', 'dalmata')
        expect(pets[0]).toHaveProperty( 'age', 1)
    })

    it('should be able to filter pets by city, race, age and details', async () => {
        const ongEmail = 'testOng@mail.com'
        const city = 'Pouso Alegre'
        const race = 'dalmata'
        const detail = 'cute'
        const ongId = randomUUID()

        await ongsRepository.create({
            id: ongId,
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
            city: city,
            detais: 'detalhes...',
            race: race,
            ong_id: ongId
        })

        await petsRepository.create({
            name: 'doguinho',
            age: 1,
            city: city,
            detais: detail,
            race: race,
            ong_id: ongId
        })

        await petsRepository.create({
            name: 'doguinho',
            age: 2,
            city: city,
            detais: 'detalhes...',
            race: 'vira lata',
            ong_id: ongId
        })

        await petsRepository.create({
            name: 'doguinho',
            age: 1,
            city: city,
            detais: 'detalhes...',
            race: race,
            ong_id: ongId
        })

        const { pets } = await sut.execute({ city, age: 1, details: detail })

        expect(pets[0]).toHaveProperty( 'race', 'dalmata')
        expect(pets[0]).toHaveProperty( 'age', 1)
        expect(pets[0]).toHaveProperty( 'detais', detail)
    })

    it('should not be able to filter pets without inform the city', async () => {
        await ongsRepository.create({
            id: 'ong01',
            name: 'ong test',
            email: 'ong@mail.com',
            password_hash: await hash('123456', 6),
            whatsapp: '35999783000',
            city: 'Pouso Alegre',
            cep: '37550000'
        })

        await petsRepository.create({
            name: 'doguinho',
            age: 2,
            city: 'Pouso Alegre',
            detais: 'detalhes...',
            race: 'dalmata',
            ong_id: 'ong01'
        })

        await expect(() =>
            sut.execute({ city: '' })
        ).rejects.toBeInstanceOf(CityNotInformedError)
    })
})
