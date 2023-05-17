import { Prisma, Pet } from '@prisma/client'
import { PetsRepository } from '../pets-repository'
import { randomUUID } from 'crypto'

export class InMemoryPetsRepository implements PetsRepository {
    public items: Pet[] = []

    async create(data: Prisma.PetUncheckedCreateInput) {
        const pet = {
            id: randomUUID(),
            name: data.name,
            age: data.age,
            race: data.race,
            detais: data.detais,
            city: data.city,
            ong_id: data.ong_id,
            created_at: new Date(),
            adopted_at: null
        }

        this.items.push(pet)
        return pet
    }

    async findByCity(city: string): Promise<Pet[]> {
        const pets = this.items.filter(item => item.city === city && item.adopted_at === null)
        return pets
    }
}
