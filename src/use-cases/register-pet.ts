import { OngsRepository } from '@/repositories/ongs-repository'
import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'

interface RegisterPetUseCaseRequest {
    name: string
    age: number
    race: string
    detais: string
    city: string
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
        name, age, race, detais, city, ong_email
    }: RegisterPetUseCaseRequest): Promise<RegisterPetUseCaseResponse> {
        const ong = await this.ongsRepository.findByEmail(ong_email)
        if (!ong) throw new Error()

        const pet = await this.petsRepository.create({
            name, age, race, detais, city, ong_id: ong.id
        })

        return { pet }
    }
}
