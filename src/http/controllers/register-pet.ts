import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeRegisterPetUseCase } from '@/use-cases/factories/make-register-pet-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerPet(request: FastifyRequest, reply: FastifyReply) {
    const registerPetBodySchema = z.object({
        name: z.string().max(50),
        age: z.number(),
        race: z.string().max(50),
        details: z.string().max(100),
        ongEmail: z.string().email()
    })

    const { name, age, race, details, ongEmail } = registerPetBodySchema.parse(request.body)

    try {
        const registerPetUseCase = makeRegisterPetUseCase()
        const { pet } = await registerPetUseCase.execute({
            name, age, race, details, ong_email: ongEmail
        })

        return reply.status(200).send(pet)
    } catch (err) {
        if (err instanceof ResourceNotFoundError) return reply.status(404).send({ message: err.message })
        throw err
    }
}
