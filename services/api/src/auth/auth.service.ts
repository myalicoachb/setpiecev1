import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(email: string, name: string, password: string) {
    const hashed = await bcrypt.hash(password, 10)
    const user = await this.prisma.user.create({ data: { email, name, password: hashed } })
    return this.generateToken(user)
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.password || '')))
      throw new UnauthorizedException('Invalid credentials')
    return this.generateToken(user)
  }

  async refresh(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new UnauthorizedException()
    return this.generateToken(user)
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role }
    return {
      access_token: this.jwt.sign(payload),
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    }
  }
}
