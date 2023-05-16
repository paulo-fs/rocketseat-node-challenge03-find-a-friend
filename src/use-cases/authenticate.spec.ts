import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryOngsRepository } from '@/repositories/in-memory/in-memory-ongs-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let repository: InMemoryOngsRepository
let sut: AuthenticateUseCase

describe('Authentication use case', () => {
    beforeEach(() => {
        repository = new InMemoryOngsRepository()
        sut = new AuthenticateUseCase(repository)
    })
    it('should be able to authenticate', async () => {
        await repository.create({
            name: 'ong 1',
            email: 'ong1@mail.com',
            password_hash: await hash('123456', 6),
            cep: '37550000',
            city: 'Pouso Alegre',
            whatsapp: '35999780000'
        })

        const { ong } = await sut.execute({
            email: 'ong1@mail.com',
            password: '123456'
        })

        expect(ong.name).toEqual('ong 1')
    })

    it('should not be able to authenticate with wrong email', async () => {
        await expect(() =>
            sut.execute({
                email: 'ong1@mail.com',
                password: '123456'
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should not be able to authenticate with wrong password', async () => {
        await repository.create({
            name: 'ong 1',
            email: 'ong1@mail.com',
            password_hash: await hash('123456', 6),
            cep: '37550000',
            city: 'Pouso Alegre',
            whatsapp: '35999780000'
        })

        await expect(() =>
            sut.execute({
                email: 'ong1@mail.com',
                password: '123123'
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})
