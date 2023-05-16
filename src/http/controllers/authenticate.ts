import { PrismaOngsRepository } from '@/repositories/prisma/prisma-ongs-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
    const authenticatedBodySchema = z.object({
        email: z.string().email(),
        password: z.string()
    })

    const { email, password } = authenticatedBodySchema.parse(req.body)

    try {
        const ongsRepository = new PrismaOngsRepository()
        const authenticateUseCase = new AuthenticateUseCase(ongsRepository)

        await authenticateUseCase.execute({ email, password })
    } catch (err) {
        if (err instanceof InvalidCredentialsError) return reply.status(400).send({ message: err.message })
        throw err
    }

    return reply.status(200).send()
}