import { Pet, Prisma } from '@prisma/client'

export interface FilterPetsRequest {
    ongId: string
    age?: number
    race?: string
    details?: string
    page?: number
}

export interface PetsRepository {
    create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
    findById(id: string): Promise<Pet | null>
    findByCity(ongId: string, page?: number): Promise<Pet[]>
    filterPets({
        ongId, age, race, details, page
    }: FilterPetsRequest): Promise<Pet[]>
}
