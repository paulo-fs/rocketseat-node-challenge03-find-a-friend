import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

interface RegisterParams {
    name: string
    email: string
    password: string
    whatsapp: string
    city: string
    cep: string
    street?: string
    district?: string
}

export async function registerUseCase({
    name, email, password, whatsapp, city, district, cep, street
}: RegisterParams) {
    const userWithSameEmail = await prisma.oNG.findUnique({ where: { email }})
    if (userWithSameEmail) throw new Error('E-mail already exists.')

    const password_hash = await hash(password, 6)

    await prisma.oNG.create({
        data: { name, email, password_hash, whatsapp, city, cep, street, district }
    })
}
