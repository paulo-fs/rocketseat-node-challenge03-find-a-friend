import { Prisma, ONG } from '@prisma/client'
import { OngsRepository } from '../ongs-repository'
import { randomUUID } from 'crypto'

export class InMemoryOngsRepository implements OngsRepository {
    public items: ONG[] = []

    async create(data: Prisma.ONGCreateInput) {
        const ong = {
            id: randomUUID(),
            name: data.name,
            email: data.email,
            password_hash: data.password_hash,
            whatsapp: data.whatsapp,
            city: data.city,
            cep: data.cep,
            street: null,
            district: null,
            created_at: new Date()
        }

        this.items.push(ong)
        return ong
    }

    async findByEmail(email: string) {
        const ong = this.items.find(item => item.email === email)

        if (!ong) return null
        return ong
    }
}
