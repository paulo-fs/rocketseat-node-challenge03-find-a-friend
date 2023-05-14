import { ONG, Prisma } from '@prisma/client'

export interface OngsRepository {
    create(data: Prisma.ONGCreateInput): Promise<ONG>
    findByEmail(email: string): Promise<ONG | null>
}
