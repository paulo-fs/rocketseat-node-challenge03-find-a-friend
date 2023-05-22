import { prisma } from '@/lib/prisma'
import { Ong, Prisma } from '@prisma/client'
import { OngsRepository } from '../ongs-repository'

export class PrismaOngsRepository implements OngsRepository{

    async create(data: Prisma.OngCreateInput) {
        const ong = await prisma.ong.create({
            data
        })
        return ong
    }

    async findById(id: string): Promise<Ong | null> {
        const ong = await prisma.ong.findUnique({
            where: { id }
        })
        return ong
    }

    async findByCity(city: string){
        const ong = await prisma.ong.findMany({ where: { city }})
        if(ong.length === 0) return null
        return ong
    }

    async findByEmail(email: string) {
        const ong = await prisma.ong.findUnique({ where: { email }})
        return ong
    }
}
