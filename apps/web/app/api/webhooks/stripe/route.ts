import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body
    const { prisma } = await import('@/lib/db')

    switch (type) {
      case 'checkout.session.completed': {
        const userId = data.object.client_reference_id
        if (userId) {
          await prisma.user.update({ where: { id: userId }, data: { subscription: 'PRO' } })
        }
        break
      }
      case 'customer.subscription.deleted': {
        const userId = data.object.metadata?.userId
        if (userId) {
          await prisma.user.update({ where: { id: userId }, data: { subscription: 'FREE' } })
        }
        break
      }
    }

    return Response.json({ received: true })
  } catch {
    return Response.json({ error: 'Invalid webhook' }, { status: 400 })
  }
}
