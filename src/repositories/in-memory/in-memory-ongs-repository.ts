import { Prisma, Ong } from '@prisma/client'
import { OngsRepository } from '../ongs-repository'
import { randomUUID } from 'crypto'

export class InMemoryOngsRepository implements OngsRepository {
    public items: Ong[] = []

    async create(data: Prisma.OngCreateInput) {
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

    async findById(id: string): Promise<Ong | null> {
        const ong = this.items.find(item => item.id === id)
        if (!ong) return null
        return ong
    }

    async findByEmail(email: string) {
        const ong = this.items.find(item => item.email === email)
        if (!ong) return null
        return ong
    }

    async findByCity(city: string){
        const ong = this.items.filter(item => item.city.toLowerCase() === city.toLowerCase())
        if (!ong) return null
        return ong
    }
}
