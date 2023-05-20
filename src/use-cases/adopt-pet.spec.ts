import { PetsRepository } from '@/repositories/pets-repository'
import { expect, describe, it, beforeEach, afterEach } from 'vitest'
import { AdoptPetUseCase } from './adopt-pet'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { OngsRepository } from '@/repositories/ongs-repository'
import { hash } from 'bcryptjs'
import { vi } from 'vitest'
import { InMemoryOngsRepository } from '@/repositories/in-memory/in-memory-ongs-repository'
import { PetAlreadyAdopted } from './errors/pet-already-adopted-error'

let petsRepository: PetsRepository
let ongsRepository: OngsRepository
let sut: AdoptPetUseCase

describe('Adopt pet use case', () => {
    beforeEach(() => {
        petsRepository = new InMemoryPetsRepository()
        ongsRepository = new InMemoryOngsRepository()
        sut = new AdoptPetUseCase(petsRepository)
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to change pet status for adopted', async () => {
        const ongEmail = 'testOng@mail.com'
        const city = 'Pouso Alegre'
        const race = 'dalmata'

        vi.setSystemTime(new Date(2023, 1, 1, 10, 0, 0))

        const { id } = await ongsRepository.create({
            name: 'ong test',
            email: ongEmail,
            password_hash: await hash('123456', 6),
            whatsapp: '35999783000',
            city: city,
            cep: '37550000'
        })

        const newPet = await petsRepository.create({
            name: 'doguinho',
            age: 2,
            details: 'detalhes...',
            race: race,
            ong_id: id
        })

        vi.setSystemTime(new Date(2023, 1, 16, 10, 0, 0))

        const { pet } = await sut.execute({ petId: newPet.id })
        expect(pet.adopted_at).toEqual(new Date(2023, 1, 16, 10, 0, 0))
    })

    it('should not be able to change status of pet that already was adopted', async () => {
        const ongEmail = 'testOng@mail.com'
        const city = 'Pouso Alegre'
        const race = 'dalmata'

        vi.setSystemTime(new Date(2023, 1, 1, 10, 0, 0))

        const { id } = await ongsRepository.create({
            name: 'ong test',
            email: ongEmail,
            password_hash: await hash('123456', 6),
            whatsapp: '35999783000',
            city: city,
            cep: '37550000'
        })

        const newPet = await petsRepository.create({
            name: 'doguinho',
            age: 2,
            details: 'detalhes...',
            race: race,
            ong_id: id
        })

        sut.execute({ petId: newPet.id })

        await expect(() =>
            sut.execute({ petId: newPet.id })
        ).rejects.toBeInstanceOf(PetAlreadyAdopted)
    })
})
