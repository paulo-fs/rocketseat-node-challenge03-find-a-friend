import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makePetProfileUseCase } from '@/use-cases/factories/make-pet-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function petProfile(request: FastifyRequest, reply: FastifyReply) {
    const petRequestSchema = z.object({
        id: z.string()
    })

    const { id } = petRequestSchema.parse(request.params)

    try {
        const petProfile = makePetProfileUseCase()
        const { pet } = await petProfile.execute(id)
        return reply.status(200).send({ pet })
    } catch (err) {
        if (err instanceof ResourceNotFoundError) return reply.status(404).send({ message: err.message })
        throw err
    }
}
