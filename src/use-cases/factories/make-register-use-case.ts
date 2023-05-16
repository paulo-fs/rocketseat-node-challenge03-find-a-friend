import { PrismaOngsRepository } from '@/repositories/prisma/prisma-ongs-repository'
import { RegisterUseCase } from '../register'

export function makeRegisterUseCase() {
    const ongsRepository = new PrismaOngsRepository()
    const registerUseCase = new RegisterUseCase(ongsRepository)

    return registerUseCase
}
