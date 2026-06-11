import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { unauthorized, ok } from '@/lib/api-helpers'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()
  const { priceId } = await req.json()

  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const checkout = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: session.user.id,
      customer_email: session.user.email!,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    })
    return ok({ url: checkout.url })
  } catch (e: any) {
    return ok({ error: e.message }, 400)
  }
}
