import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.enableCors({ origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', credentials: true })
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
  await app.listen(4000)
}
bootstrap()
