import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'
import { CityNotInformedError } from './errors/city-not-informed-error'
import { OngsRepository } from '@/repositories/ongs-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface FilterPetsUseCaseRequest {
    city: string
    age?: number
    race?: string
    details?: string
    page?: number
}

interface FilterPetsUseCaseResponse {
    pets: Pet[]
}

export class FilterPetsUseCase {
    constructor(
        private petsRepository: PetsRepository,
        private ongsRepository: OngsRepository
    ) {}

    async execute({
        city, age, race, details, page
    }: FilterPetsUseCaseRequest): Promise<FilterPetsUseCaseResponse> {
        if (!city) throw new CityNotInformedError()

        const ong = await this.ongsRepository.findByCity(city)
        if (!ong) throw new ResourceNotFoundError()

        const pets = await this.petsRepository.filterPets({ ongId: ong.id, age, race, details, page })
        return { pets }
    }
}
