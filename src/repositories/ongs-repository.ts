import { Ong, Prisma } from '@prisma/client'

export interface OngsRepository {
    create(data: Prisma.OngCreateInput): Promise<Ong>
    findByEmail(email: string): Promise<Ong | null>
    findByCity(city: string): Promise<Ong | null>
}
