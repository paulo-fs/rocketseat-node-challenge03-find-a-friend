import { PrismaOngsRepository } from '@/repositories/prisma/prisma-ongs-repository'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { RegisterPetUseCase } from '../register-pet'

export function makeRegisterPetUseCase() {
    const ongsRepository = new PrismaOngsRepository()
    const petsRepository = new PrismaPetsRepository()
    const useCase = new RegisterPetUseCase(petsRepository, ongsRepository)
    return useCase
}
