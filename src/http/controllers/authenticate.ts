import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
    const authenticatedBodySchema = z.object({
        email: z.string().email(),
        password: z.string()
    })

    const { email, password } = authenticatedBodySchema.parse(req.body)

    try {
        const authenticateUseCase = makeAuthenticateUseCase()
        const { ong } = await authenticateUseCase.execute({ email, password })

        const token = await reply.jwtSign({}, {
            sign: { sub: ong.id }
        })

        const refreshToken = await reply.jwtSign(
            {},
            {
                sign: {
                    sub: ong.id,
                    expiresIn: '7d'
                }
            }
        )

        return reply
            .setCookie('refreshToken', refreshToken, {
                path: '/',
                secure: true,
                sameSite: true,
                httpOnly: true
            })
            .status(200).send({ token })
    } catch (err) {
        if (err instanceof InvalidCredentialsError) return reply.status(400).send({ message: err.message })
        throw err
    }

}
