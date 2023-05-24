import { Pet, Prisma } from '@prisma/client'

export interface FilterPetsRequest {
    city: string
    age?: number
    race?: string
    details?: string
    page?: string
}

export interface PetsRepository {
    create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
    findById(id: string): Promise<Pet | null>
    findByCity(ongId: string, page?: string): Promise<Pet[]>
    filterPets({
        city, age, race, details, page
    }: FilterPetsRequest): Promise<Pet[]>
    adoptAPet(id: string): Promise<void>
}
