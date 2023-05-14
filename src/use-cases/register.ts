import { OngsRepository } from '@/repositories/ongs-repository'
import { hash } from 'bcryptjs'

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

export class RegisterUseCase {
    constructor(private ongsRepository: OngsRepository) {}

    async execute({
        name, email, password, whatsapp, city, district, cep, street
    }: RegisterUseCaseRequest) {
        const userWithSameEmail = await this.ongsRepository.findByEmail(email)
        if (userWithSameEmail) throw new Error('E-mail already exists.')

        const password_hash = await hash(password, 6)

        await this.ongsRepository.create({
            name, email, password_hash, whatsapp, city, district, cep, street
        })
    }
}

