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

    async findByCity(ongId: string) {
        return this.items.filter(pet => pet.ong_id === ongId)
    }

    async filterPets({ ongId, age, race, details }: FilterPetsRequest): Promise<Pet[]> {
        let pets = this.items.filter(pet => pet.ong_id === ongId)
        if(age) pets = pets.filter(pet => pet.age === age)
        if(race) pets = pets.filter(pet => pet.race.toLowerCase() === race.toLowerCase())
        if(details) pets = pets.filter(pet => pet.details.toLowerCase() === details.toLowerCase())
        return pets
    }
}
