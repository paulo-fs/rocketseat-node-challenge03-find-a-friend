import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'
import { CityNotInformedError } from './errors/city-not-informed-error'

interface FilterPetsUseCaseRequest {
    city: string
    age?: number
    race?: string
    details?: string
}

interface FilterPetsUseCaseResponse {
    pets: Pet[]
}

export class FilterPetsUseCase {
    constructor(
        private petsRepository: PetsRepository
    ) {}

    async execute({
        city, age, race, details
    }: FilterPetsUseCaseRequest): Promise<FilterPetsUseCaseResponse> {
        if (!city) throw new CityNotInformedError()

        const pets = await this.petsRepository.filterPets({ city, age, race, details })
        return { pets }
    }
}
