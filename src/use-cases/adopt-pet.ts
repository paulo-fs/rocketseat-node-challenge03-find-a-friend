import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { PetAlreadyAdopted } from './errors/pet-already-adopted-error'

interface AdoptPetUseCaseRequest {
    petId: string
}

interface AdoptPetUseCaseResponse {
    pet: Pet
}

export class AdoptPetUseCase {
    constructor(
        private petsRepository: PetsRepository
    ) {}

    async execute(data: AdoptPetUseCaseRequest): Promise<AdoptPetUseCaseResponse> {
        const { petId } = data

        const pet = await this.petsRepository.findById(petId)
        if (!pet) throw new ResourceNotFoundError()
        if(pet.adopted_at !== null) throw new PetAlreadyAdopted()

        pet.adopted_at = new Date()

        return { pet }
    }
}
