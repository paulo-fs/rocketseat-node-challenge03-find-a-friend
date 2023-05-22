import { CityNotInformedError } from '@/use-cases/errors/city-not-informed-error'
import { makeFilterPetsUseCase } from '@/use-cases/factories/make-filter-pets-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function filterPets(request: FastifyRequest, reply: FastifyReply) {
    const filterPetsParamsSchema = z.object({
        city: z.string().max(50),
        age: z.string().optional(),
        race: z.string().optional(),
        details: z.string().optional(),
        page: z.string().optional()
    })

    const { city, age, race, details, page } = filterPetsParamsSchema.parse(request.query)

    try {
        const filterPetsUseCase = makeFilterPetsUseCase()
        const { pets } = await filterPetsUseCase.execute({
            city, age, race, details, page
        })

        return reply.status(200).send(pets)
    } catch (err) {
        if (err instanceof CityNotInformedError) return reply.status(400).send({ message: err.message })
        throw err
    }
}
