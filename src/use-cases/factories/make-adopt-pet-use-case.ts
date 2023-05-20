import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { AdoptPetUseCase } from '../adopt-pet'

export function makeAdoptPetUseCase() {
    const petsRepository = new PrismaPetsRepository()
    const useCase = new AdoptPetUseCase(petsRepository)
    return useCase
}
