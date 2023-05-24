import { PetsRepository } from '@/repositories/pets-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { PetAlreadyAdopted } from './errors/pet-already-adopted-error'

export class AdoptPetUseCase {
    constructor(
        private petsRepository: PetsRepository
    ) {}

    async execute(id: string): Promise<void> {
        const pet = await this.petsRepository.findById(id)
        if (!pet) throw new ResourceNotFoundError()
        if(pet.adopted_at !== null) throw new PetAlreadyAdopted()

        await this.petsRepository.adoptAPet(id)
    }
}
