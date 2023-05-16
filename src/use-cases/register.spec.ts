import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryOngsRepository } from '@/repositories/in-memory/in-memory-ongs-repository'
import { OngAlreadyExistsError } from './errors/ong-already-exist-error'

let repository: InMemoryOngsRepository
let sut: RegisterUseCase

describe('register use case', () => {
    beforeEach(() => {
        repository = new InMemoryOngsRepository()
        sut = new RegisterUseCase(repository)
    })

    it('should hash ong password upon registration', async () => {
        const { ong } = await sut.execute({
            name: 'ong test',
            email: 'emailteste9@teste.com',
            password: '123456',
            whatsapp: '35999783000',
            city: 'teste',
            cep: '37550000'
        })

        const isPasswordCorrectlyHashed = await compare(
            '123456',
            ong.password_hash
        )

        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('should not be able to register with the same email twice', async () => {
        const email = 'teste@mail.com'

        await sut.execute({
            name: 'ong test',
            email,
            password: '123456',
            whatsapp: '35999783000',
            city: 'teste',
            cep: '37550000'
        })

        await expect(() =>
            sut.execute({
                name: 'ong test2',
                email,
                password: '123456',
                whatsapp: '35999783000',
                city: 'teste',
                cep: '37550000'
            })
        ).rejects.toBeInstanceOf(OngAlreadyExistsError)
    })

    it('should be able to register', async () => {
        const { ong } = await sut.execute({
            name: 'ong test',
            email: 'emailteste9@teste.com',
            password: '123456',
            whatsapp: '35999783000',
            city: 'teste',
            cep: '37550000'
        })

        expect(ong.id).toEqual(expect.any(String))
    })
})


