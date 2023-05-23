import { OngsRepository } from '@/repositories/ongs-repository'
import { PetsRepository } from '@/repositories/pets-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterPetUseCase } from './register-pet'
import { InMemoryOngsRepository } from '@/repositories/in-memory/in-memory-ongs-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let ongsRepository: OngsRepository
let petsRepository: PetsRepository
let sut: RegisterPetUseCase

describe('Register Pet use case', () => {
    beforeEach(() => {
        ongsRepository = new InMemoryOngsRepository()
        petsRepository = new InMemoryPetsRepository()
        sut = new RegisterPetUseCase(petsRepository, ongsRepository)
    })

    it('should be able to register a pet', async () => {
        const ongEmail = 'testOng@mail.com'

        ongsRepository.create({
            name: 'ong test',
            email: ongEmail,
            password_hash: await hash('123456', 6),
            whatsapp: '35999783000',
            city: 'teste',
            cep: '37550000'
        })

        const { pet } = await sut.execute({
            name: 'doguinho',
            age: 2,
            details: 'detalhes...',
            race: 'vira lata',
            ong_email: ongEmail
        })

        expect(pet.name).toEqual('doguinho')
    })

    it('should not be able to register a pet without an ong', async () => {
        await expect(() =>
            sut.execute({
                name: 'doguinho',
                age: 2,
                details: 'detalhes...',
                race: 'vira lata',
                ong_email: ''
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})
