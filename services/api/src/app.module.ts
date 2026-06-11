import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { AuthModule } from './auth/auth.module'
import { VideosModule } from './videos/videos.module'
import { CoursesModule } from './courses/courses.module'
import { ArticlesModule } from './articles/articles.module'
import { DrawingsModule } from './drawings/drawings.module'
import { PrismaModule } from './prisma/prisma.module'
import { SubscriptionsModule } from './subscriptions/subscriptions.module'
import { WebhooksModule } from './webhooks/webhooks.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    VideosModule,
    CoursesModule,
    ArticlesModule,
    DrawingsModule,
    SubscriptionsModule,
    WebhooksModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
