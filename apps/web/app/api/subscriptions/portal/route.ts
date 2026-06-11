import { auth } from '@/lib/auth'
import { unauthorized, ok } from '@/lib/api-helpers'

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()
  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const portal = await stripe.billingPortal.sessions.create({
      customer: session.user.id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    })
    return ok({ url: portal.url })
  } catch (e: any) {
    return ok({ error: e.message }, 400)
  }
}
