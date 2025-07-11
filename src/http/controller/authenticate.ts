import { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repositories'

import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidadCrenditalsError } from '@/use-cases/errors/invalidad-credentials-error'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodyShema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  try {
    const usersRepository = new PrismaUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)

    const { email, password } = authenticateBodyShema.parse(request.body)
    console.log('BODY:', request.body)

    await authenticateUseCase.execute({
      email,
      password,
    })
  } catch (err) {
    if (err instanceof InvalidadCrenditalsError) {
      return reply.status(400).send()
    }
    console.error(err)
    return reply.status(500).send({ message: 'Internal server errooor' })
  }

  return reply.status(200).send()
}
