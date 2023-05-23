import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface PetProfileUseCaseResponse {
    pet: Pet
}

export class PetProfileUseCase {
    constructor(
        private petsRepository: PetsRepository
    ) {}

    async execute(id: string): Promise<PetProfileUseCaseResponse> {
        const pet = await this.petsRepository.findById(id)
        if (!pet) throw new ResourceNotFoundError()
        return { pet }
    }
}
