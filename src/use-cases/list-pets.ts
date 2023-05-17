import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'
import { CityNotInformedError } from './errors/city-not-informed-error'

interface ListPetUseCaseRequest {
    city: string
}

interface ListPetUseCaseResponse {
    pets: Pet[]
}

export class ListPetUseCase {
    constructor(private petsRepository: PetsRepository){}

    async execute({ city }: ListPetUseCaseRequest): Promise<ListPetUseCaseResponse> {
        if (!city) throw new CityNotInformedError()

        const pets = await this.petsRepository.findByCity(city)
        return { pets }
    }
}
