import { CityNotInformedError } from '@/use-cases/errors/city-not-informed-error'
import { makeListPetsUseCase } from '@/use-cases/factories/make-list-pets-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function listPets(request: FastifyRequest, reply: FastifyReply) {
    const listPetsParamsSchema = z.object({
        city: z.string(),
        page: z.string().optional()
    })

    const { city, page } = listPetsParamsSchema.parse(request.query)

    try {
        const listPetsUseCase = makeListPetsUseCase()
        const { pets } = await listPetsUseCase.execute({ city, page })

        return reply.status(200).send({ pets })
    } catch (err) {
        if (err instanceof CityNotInformedError) return reply.status(400).send({ message: err.message })
        throw err
    }
}
