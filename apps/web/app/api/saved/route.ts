import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { unauthorized, ok } from '@/lib/api-helpers'
import { savedContentQueries } from '@/lib/queries'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()
  const items = await savedContentQueries.getUserSaved(session.user.id)
  return ok(items)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()
  const { contentId, contentType } = await req.json()
  const result = await savedContentQueries.toggle(session.user.id, contentId, contentType)
  return ok(result, 201)
}
