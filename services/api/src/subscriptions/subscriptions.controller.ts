import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { SubscriptionsService } from './subscriptions.service'

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private service: SubscriptionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('checkout')
  createCheckoutSession(@Body() body: { priceId: string }, @Req() req: any) {
    return this.service.createCheckoutSession(req.user.id, body.priceId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getSubscription(@Req() req: any) {
    return this.service.getSubscription(req.user.id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('invoices')
  getUserInvoices(@Req() req: any) {
    return this.service.getUserInvoices(req.user.id)
  }
}
