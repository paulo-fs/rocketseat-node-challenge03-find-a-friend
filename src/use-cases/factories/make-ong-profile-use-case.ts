import { PrismaOngsRepository } from '@/repositories/prisma/prisma-ongs-repository'
import { OngProfileUseCase } from '../ong-profile'

export function makeOngProfileUseCase() {
    const ongsRepository = new PrismaOngsRepository()
    const useCase = new OngProfileUseCase(ongsRepository)
    return useCase
}
