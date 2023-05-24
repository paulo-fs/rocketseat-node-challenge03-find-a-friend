import { Prisma, Pet } from '@prisma/client'
import { FilterPetsRequest, PetsRepository } from '../pets-repository'
import { prisma } from '@/lib/prisma'

export class PrismaPetsRepository implements PetsRepository {
    async create(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
        const pet = await prisma.pet.create({ data })
        return pet
    }
    async findById(id: string): Promise<Pet | null> {
        const pet = await prisma.pet.findUnique({
            where: { id },
            include: {
                ong: {
                    select: {
                        name: true,
                        email: true,
                        whatsapp: true
                    }
                }
            }
        })
        return pet
    }
    async findByCity(ongId: string, page = '1'): Promise<Pet[]> {
        const pets = await prisma.pet.findMany({
            where: { ong_id: ongId },
            take: 20,
            skip: (Number(page) - 1) * 20
        })
        return pets
    }
    async filterPets({ city, age, race, details, page = '1' }: FilterPetsRequest): Promise<Pet[]> {
        const pets = await prisma.pet.findMany({
            where: {
                ong: {
                    city: city
                },
                age: {
                    equals: age
                },
                race: {
                    contains: race,
                    mode: 'insensitive'
                },
                details: {
                    contains: details,
                    mode: 'insensitive'
                },
                adopted_at: null
            },
            take: 20,
            skip: (Number(page) - 1) * 20
        })

        return pets
    }

    async adoptAPet(id: string) {
        await prisma.pet.update({
            where: { id },
            data: { adopted_at: new Date() }
        })
    }
}
