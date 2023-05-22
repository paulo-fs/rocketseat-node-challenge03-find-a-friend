import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'
import { CityNotInformedError } from './errors/city-not-informed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface FilterPetsUseCaseRequest {
    city: string
    age?: string
    race?: string
    details?: string
    page?: string
}

interface FilterPetsUseCaseResponse {
    pets: Pet[]
}

export class FilterPetsUseCase {
    constructor(
        private petsRepository: PetsRepository,
    ) {}

    async execute({
        city, age, race, details, page
    }: FilterPetsUseCaseRequest): Promise<FilterPetsUseCaseResponse> {
        if (!city) throw new CityNotInformedError()

        const pets = await this.petsRepository.filterPets({ city, age: Number(age), race, details, page })

        if (pets.length === 0) throw new ResourceNotFoundError()

        return { pets }
    }
}
