import { PrismaOngsRepository } from '@/repositories/prisma/prisma-ongs-repository'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { FilterPetsUseCase } from '../filter-pets'

export function makeFilterPetsUseCase() {
    const petsRepository = new PrismaPetsRepository()
    const ongsRepository = new PrismaOngsRepository()
    const useCase = new FilterPetsUseCase(petsRepository, ongsRepository)
    return useCase
}
