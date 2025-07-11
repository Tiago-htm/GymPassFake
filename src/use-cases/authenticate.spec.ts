import { it, expect, beforeEach } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { InvalidadCrenditalsError } from './errors/invalidad-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

beforeEach(() => {
  usersRepository = new InMemoryUsersRepository()
  sut = new AuthenticateUseCase(usersRepository)
})

it('should be able to authenticate with correct credentials', async () => {
  await usersRepository.create({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password_hash: await hash('123456', 6),
  })

  const { user } = await sut.execute({
    email: 'johndoe@example.com',
    password: '123456',
  })

  expect(user.id).toEqual(expect.any(String))
})

it('should not be able to authenticate with wrong email', async () => {
  await expect(() =>
    sut.execute({
      email: 'nonexistent@example.com',
      password: '123456',
    }),
  ).rejects.toBeInstanceOf(InvalidadCrenditalsError)
})

it('should not be able to authenticate with wrong password', async () => {
  await usersRepository.create({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password_hash: await hash('123456', 6),
  })

  await expect(() =>
    sut.execute({
      email: 'johndoe@example.com',
      password: 'wrong-password',
    }),
  ).rejects.toBeInstanceOf(InvalidadCrenditalsError)
})
