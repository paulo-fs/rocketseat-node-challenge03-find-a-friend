import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'
import { CityNotInformedError } from './errors/city-not-informed-error'
import { OngsRepository } from '@/repositories/ongs-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ListPetUseCaseRequest {
    city: string
}

interface ListPetUseCaseResponse {
    pets: Pet[]
}

export class ListPetUseCase {
    constructor(
        private petsRepository: PetsRepository,
        private ongsRepository: OngsRepository
    ){}

    async execute({ city }: ListPetUseCaseRequest): Promise<ListPetUseCaseResponse> {
        if (!city) throw new CityNotInformedError()

        const ong = await this.ongsRepository.findByCity(city)
        if (!ong) throw new ResourceNotFoundError()
        const pets = await this.petsRepository.findByCity(ong.id)
        return { pets }
    }
}
