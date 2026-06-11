import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { unauthorized, ok } from '@/lib/api-helpers'
import { enrollmentQueries } from '@/lib/queries'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()
  const enrollment = await enrollmentQueries.upsert(session.user.id, params.id)
  return ok(enrollment, 201)
}
