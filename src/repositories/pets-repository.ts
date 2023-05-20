import { Pet, Prisma } from '@prisma/client'

export interface FilterPetsRequest {
    city: string
    age?: number
    race?: string
    details?: string
}

export interface PetsRepository {
    create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
    findByCity(city: string): Promise<Pet[]>
    filterPets({
        city, age, race, details
    }: FilterPetsRequest): Promise<Pet[]>
}
