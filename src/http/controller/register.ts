import { FastifyRequest, FastifyReply } from 'fastify'

import { prisma } from '@/lib/prisma'
import z from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    passaword: z.string().min(6),
  })

  const { name, email, passaword } = registerBodySchema.parse(request.body)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: passaword,
    },
  })

  return reply.status(201).send()
}
