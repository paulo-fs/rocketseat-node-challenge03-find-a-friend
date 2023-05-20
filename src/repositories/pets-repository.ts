import { Pet, Prisma } from '@prisma/client'

export interface FilterPetsRequest {
    ongId: string
    age?: number
    race?: string
    details?: string
}

export interface PetsRepository {
    create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
    findById(id: string): Promise<Pet | null>
    findByCity(ongId: string): Promise<Pet[]>
    filterPets({
        ongId, age, race, details
    }: FilterPetsRequest): Promise<Pet[]>
}
