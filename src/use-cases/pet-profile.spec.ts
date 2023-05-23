import { PetsRepository } from '@/repositories/pets-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { PetProfileUseCase } from './pet-profile'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { OngsRepository } from '@/repositories/ongs-repository'
import { InMemoryOngsRepository } from '@/repositories/in-memory/in-memory-ongs-repository'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let petsRepository: PetsRepository
let ongsRepository: OngsRepository
let sut: PetProfileUseCase

describe('Pet profile use case', () => {
    beforeEach(() => {
        petsRepository = new InMemoryPetsRepository()
        ongsRepository = new InMemoryOngsRepository()
        sut = new PetProfileUseCase(petsRepository)
    })

    it('should be able see the profile of a pet', async () => {
        const ong = await ongsRepository.create({
            name: 'ong test',
            email: 'testOng@mail.com',
            password_hash: await hash('123456', 6),
            whatsapp: '35999783000',
            city: 'Pouso Alegre',
            cep: '37550000'
        })

        const { id } = await petsRepository.create({
            name: 'doguinho',
            age: 2,
            details: 'detalhes...',
            race: 'vira lata',
            ong_id: ong.id
        })

        const { pet } = await sut.execute(id)

        expect(pet.name).toEqual('doguinho')
    })

    it('should not be able to see a pet profile with a wrong id', async () => {
        const ong = await ongsRepository.create({
            name: 'ong test',
            email: 'testOng@mail.com',
            password_hash: await hash('123456', 6),
            whatsapp: '35999783000',
            city: 'Pouso Alegre',
            cep: '37550000'
        })

        await petsRepository.create({
            name: 'doguinho',
            age: 2,
            details: 'detalhes...',
            race: 'vira lata',
            ong_id: ong.id
        })

        await expect(() =>
            sut.execute('wrongId')
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})
