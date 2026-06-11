import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import Stripe from 'stripe'

@Injectable()
export class SubscriptionsService {
  private stripe: Stripe

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' as any })
  }

  async createCheckoutSession(userId: string, priceId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundException('User not found')

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing`,
      metadata: { userId },
    })

    return { url: session.url, sessionId: session.id }
  }

  async getSubscription(userId: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { userId } })
    if (!sub) return { active: false }
    return sub
  }

  async getUserInvoices(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user?.stripeCustomerId) return []
    const invoices = await this.stripe.invoices.list({ customer: user.stripeCustomerId, limit: 12 })
    return invoices.data.map((inv) => ({
      id: inv.id,
      amount: inv.amount_paid,
      currency: inv.currency,
      status: inv.status,
      date: new Date(inv.created * 1000).toISOString(),
      pdf: inv.invoice_pdf,
    }))
  }
}
