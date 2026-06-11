import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() body: { email: string; name: string; password: string }) {
    return this.auth.register(body.email, body.name, body.password)
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body.email, body.password)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('refresh')
  refresh(@Req() req: any) {
    return this.auth.refresh(req.user.id)
  }
}
