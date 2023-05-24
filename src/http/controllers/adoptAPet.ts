import { PetAlreadyAdopted } from '@/use-cases/errors/pet-already-adopted-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeAdoptPetUseCase } from '@/use-cases/factories/make-adopt-pet-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function adoptAPet(request: FastifyRequest, reply: FastifyReply) {
    const petRequestSchema = z.object({
        id: z.string()
    })

    const { id } = petRequestSchema.parse(request.body)

    try {
        const adoptAPet = makeAdoptPetUseCase()
        await adoptAPet.execute(id)
        return reply.status(201).send({ message: 'Pet adopted succesfully.' })
    } catch (err) {
        if (err instanceof ResourceNotFoundError || err instanceof PetAlreadyAdopted) return reply.status(400).send({ message: err.message })
        throw err
    }
}
