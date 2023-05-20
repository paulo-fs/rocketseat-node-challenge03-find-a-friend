import { PrismaOngsRepository } from '@/repositories/prisma/prisma-ongs-repository'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { ListPetUseCase } from '../list-pets'

export function makeListPetsUseCase() {
    const petsRepository = new PrismaPetsRepository()
    const ongsRepository = new PrismaOngsRepository()
    const useCase = new ListPetUseCase(petsRepository, ongsRepository)
    return useCase
}
