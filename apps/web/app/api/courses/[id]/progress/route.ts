import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { unauthorized, ok } from '@/lib/api-helpers'
import { enrollmentQueries } from '@/lib/queries'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()
  const body = await req.json()
  const enrollment = await enrollmentQueries.updateProgress(session.user.id, params.id, body.progress)
  return ok(enrollment)
}
