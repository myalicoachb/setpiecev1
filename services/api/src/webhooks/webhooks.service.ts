import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import Stripe from 'stripe'

@Injectable()
export class WebhooksService {
  private stripe: Stripe

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' as any })
  }

  async handleStripeEvent(signature: string, payload: Buffer) {
    const event = this.stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET || '')

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        if (userId && session.subscription) {
          await this.prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: session.customer as string } })
          await this.prisma.subscription.upsert({
            where: { userId },
            create: { userId, stripeSubscriptionId: session.subscription as string, status: 'active', currentPeriodStart: new Date(), currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
            update: { stripeSubscriptionId: session.subscription as string, status: 'active' },
          })
        }
        break
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          const sub = await this.prisma.subscription.findFirst({ where: { stripeSubscriptionId: invoice.subscription as string } })
          if (sub) {
            await this.prisma.subscription.update({
              where: { id: sub.id },
              data: { currentPeriodStart: new Date(invoice.period_start * 1000), currentPeriodEnd: new Date(invoice.period_end * 1000), status: 'active' },
            })
          }
        }
        break
      }
      case 'customer.subscription.deleted': {
        const subEvent = event.data.object as Stripe.Subscription
        const sub = await this.prisma.subscription.findFirst({ where: { stripeSubscriptionId: subEvent.id } })
        if (sub) {
          await this.prisma.subscription.update({ where: { id: sub.id }, data: { status: 'canceled' } })
        }
        break
      }
    }

    return { received: true }
  }

  async handleMuxEvent(body: any) {
    const { type, data } = body

    if (type === 'video.asset.ready' && data?.asset_id) {
      const playbackId = data.playback_ids?.[0]?.id
      if (playbackId) {
        await this.prisma.video.updateMany({
          where: { muxAssetId: data.asset_id },
          data: { playbackId, status: 'ready' },
        })
      }
    }

    if (type === 'video.asset.errored' && data?.asset_id) {
      await this.prisma.video.updateMany({
        where: { muxAssetId: data.asset_id },
        data: { status: 'error' },
      })
    }

    return { received: true }
  }
}
