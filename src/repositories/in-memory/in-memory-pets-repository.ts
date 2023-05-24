import { Prisma, Pet } from '@prisma/client'
import { FilterPetsRequest, PetsRepository } from '../pets-repository'
import { randomUUID } from 'crypto'

export class InMemoryPetsRepository implements PetsRepository {
    public items: Pet[] = []

    async create(data: Prisma.PetUncheckedCreateInput) {
        const pet = {
            id: randomUUID(),
            name: data.name,
            age: data.age,
            race: data.race,
            details: data.details,
            ong_id: data.ong_id,
            created_at: new Date(),
            adopted_at: null
        }

        this.items.push(pet)
        return pet
    }

    async findById(id: string) {
        const pet =  this.items.filter(pet => pet.id === id)[0]
        return pet ?? null
    }

    async findByCity(ongId: string, page = '1') {
        return this.items.filter(pet => pet.ong_id === ongId)
            .slice((Number(page) -1) * 20, Number(page) * 20)
    }

    async filterPets({ age, race, details, page = '1' }: FilterPetsRequest): Promise<Pet[]> {
        let pets = this.items.filter(pet => pet.adopted_at === null)
        if(age) pets = pets.filter(pet => pet.age === age)
        if(race) pets = pets.filter(pet => pet.race.toLowerCase() === race.toLowerCase())
        if(details) pets = pets.filter(pet => pet.details.toLowerCase() === details.toLowerCase())
        return pets.slice((Number(page) - 1) * 20, Number(page) * 20)
    }

    async adoptAPet(id: string): Promise<void> {
        const pet = this.items.find(pet => pet.id === id)
        if(pet) pet.adopted_at = new Date()
    }
}
