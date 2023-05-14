import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { hash } from 'bcryptjs'

export async function register (req: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
        whatsapp: z.string(),
        city: z.string().max(50),
        cep: z.string().max(8),
        street: z.string().max(50).optional(),
        district: z.string().max(50).optional()
    })

    const { name, email, password, whatsapp, city, cep, district } = registerBodySchema.parse(req.body)

    const userWithSameEmail = await prisma.oNG.findUnique({ where: { email}})
    if (userWithSameEmail) return reply.status(409).send()

    const password_hash = await hash(password, 6)

    await prisma.oNG.create({
        data: { name, email, password_hash, whatsapp, city, cep, district }
    })

    return reply.status(201).send()
}
