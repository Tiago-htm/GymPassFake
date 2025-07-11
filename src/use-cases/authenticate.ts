import { UsersRepository } from '@/repositories/users-repository'
import { InvalidadCrenditalsError } from './errors/invalidad-credentials-error'
import { User } from '@prisma/client'
import { compare } from 'bcryptjs'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  // dependencia com usuario
  constructor(private usersRepositorry: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepositorry.findByEmail(email)

    if (!user) {
      throw new InvalidadCrenditalsError()
    }

    // Quando uma varialvel for Booleana  a gente sempre começa com verbo is  has does, dando sentindo de pergunta na variavel
    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidadCrenditalsError()
    }

    return {
      user,
    }
  }
}
