import fastify from 'fastify'
import { z } from 'zod'
import { prisma } from './lib/prisma'
export const app = fastify()

app.post('/ong', async (req, reply) => {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password_hash: z.string().min(6),
        whatsapp: z.string(),
        city: z.string().max(50),
        cep: z.string().max(8),
        street: z.string().max(50).optional(),
        district: z.string().max(50).optional()
    })

    const { name, email, password_hash, whatsapp, city, cep, district } = registerBodySchema.parse(req.body)

    await prisma.oNG.create({
        data: { name, email, password_hash, whatsapp, city, cep, district }
    })

    return reply.status(201).send()
})
