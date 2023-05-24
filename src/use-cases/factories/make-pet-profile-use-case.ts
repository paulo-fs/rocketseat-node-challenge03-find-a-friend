import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { PetProfileUseCase } from '../pet-profile'

export function makePetProfileUseCase() {
    const petsRepository = new PrismaPetsRepository()
    const useCase = new PetProfileUseCase(petsRepository)
    return useCase
}
