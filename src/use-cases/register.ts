import { OngsRepository } from '@/repositories/ongs-repository'
import { hash } from 'bcryptjs'
import { OngAlreadyExistsError } from './errors/ong-already-exist-error'
import { ONG } from '@prisma/client'

interface RegisterUseCaseRequest {
    name: string
    email: string
    password: string
    whatsapp: string
    city: string
    cep: string
    street?: string
    district?: string
}

interface RegisterUseCaseResponse {
    ong: ONG
}

export class RegisterUseCase {
    constructor(private ongsRepository: OngsRepository) {}

    async execute({
        name, email, password, whatsapp, city, district, cep, street
    }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const userWithSameEmail = await this.ongsRepository.findByEmail(email)
        if (userWithSameEmail) throw new OngAlreadyExistsError()

        const password_hash = await hash(password, 6)

        const ong = await this.ongsRepository.create({
            name, email, password_hash, whatsapp, city, district, cep, street
        })

        return { ong }
    }
}

