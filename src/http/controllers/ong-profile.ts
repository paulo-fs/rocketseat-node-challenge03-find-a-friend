import { makeOngProfileUseCase } from '@/use-cases/factories/make-ong-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function ongProfile(request: FastifyRequest, reply: FastifyReply) {
    const { sub } = request.user

    const ongProfile = makeOngProfileUseCase()
    const { ong } = await ongProfile.execute({ id: sub })

    return reply.status(200).send({
        ong: {
            ...ong,
            password_hash: undefined
        }

    })
}
