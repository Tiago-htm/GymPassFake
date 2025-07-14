import { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'

import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists'
import { makeRegisterUserCase } from '@/use-cases/factories/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  try {
    const registerUseCase = makeRegisterUserCase()

    const { name, email, password } = registerBodySchema.parse(request.body)
    console.log('BODY:', request.body)

    await registerUseCase.execute({
      name,
      email,
      password,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send()
    }
    console.error(err)
    return reply.status(500).send({ message: 'Internal server errooor' })
  }

  return reply.status(201).send()
}
