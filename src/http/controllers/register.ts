import { PrismaOngsRepository } from '@/repositories/prisma/prisma-ongs-repository'
import { OngAlreadyExistsError } from '@/use-cases/errors/ong-already-exist-error'
import { RegisterUseCase } from '@/use-cases/register'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

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

    const { name, email, password, whatsapp, city, cep, street, district } = registerBodySchema.parse(req.body)

    try {
        const ongsRepository = new PrismaOngsRepository()
        const registerUseCase = new RegisterUseCase(ongsRepository)

        await registerUseCase.execute({
            name,
            email,
            password,
            whatsapp,
            city,
            cep,
            street,
            district
        })
    } catch (err) {
        if (err instanceof OngAlreadyExistsError) return reply.status(409).send({message: err.message})
        throw err
    }

    return reply.status(201).send()
}
