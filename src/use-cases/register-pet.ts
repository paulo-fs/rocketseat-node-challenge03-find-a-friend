import { OngsRepository } from '@/repositories/ongs-repository'
import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface RegisterPetUseCaseRequest {
    name: string
    age: number
    race: string
    details: string
    ong_email: string
}

interface RegisterPetUseCaseResponse {
    pet: Pet
}

export class RegisterPetUseCase {
    constructor(
        private petsRepository: PetsRepository,
        private ongsRepository: OngsRepository
    ) {}

    async execute({
        name, age, race, details, ong_email
    }: RegisterPetUseCaseRequest): Promise<RegisterPetUseCaseResponse> {
        const ong = await this.ongsRepository.findByEmail(ong_email)
        if (!ong) throw new ResourceNotFoundError()

        const pet = await this.petsRepository.create({
            name, age, race, details, ong_id: ong.id
        })

        return { pet }
    }
}
